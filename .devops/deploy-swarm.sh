#!/usr/bin/env bash
set -euo pipefail

POLL=3
MAX=$(( (${TIMEOUT:-300} + POLL - 1) / POLL ))

die() { echo "$*" >&2; exit 1; }

SSH_USER=${SSH_USER:?}
SSH_HOST=${SSH_HOST:?}
PROJECT=${PROJECT:?}
CNAME=${CNAME:?}

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

dx() { DOCKER_HOST="ssh://${SSH_USER}@${SSH_HOST}" docker "$@"; }

net() { dx network inspect "$1" &>/dev/null || dx network create --driver overlay --attachable "$1"; }

swarm() {
  local s
  s=$(dx info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || echo inactive)
  [[ $s == active ]] && return 0
  [[ -n ${SWARM_ADVERTISE_ADDR:-} ]] || die "SWARM_ADVERTISE_ADDR required for swarm init"
  dx swarm init --advertise-addr "$SWARM_ADVERTISE_ADDR"
}

deploy_stack() { dx stack deploy --with-registry-auth -c "$2" "$1"; }

wait_svc() {
  local svc=$1 i st rep h w
  for ((i = 1; i <= MAX; i++)); do
    dx service inspect "$svc" &>/dev/null || { sleep "$POLL"; continue; }
    st=$(dx service inspect "$svc" --format '{{if .UpdateStatus}}{{.UpdateStatus.State}}{{else}}completed{{end}}' 2>/dev/null | tr '[:upper:]' '[:lower:]')
    case $st in rollback_completed|rollback_paused|paused)
      dx service ps "$svc" --no-trunc || true
      die "$svc: update $st"
      ;;
    esac
    rep=$(dx service ls --format '{{.Name}} {{.Replicas}}' 2>/dev/null | awk -v n="$svc" '$1 == n { print $2; exit }')
    [[ $rep == *"/"* ]] || { sleep "$POLL"; continue; }
    h=${rep%%/*}
    w=${rep##*/}
    if [[ $h == "$w" && $w != 0 && $st == completed ]]; then
      if dx service ps "$svc" --filter desired-state=running --format '{{.CurrentState}}' 2>/dev/null | grep -qE '^Failed|^Rejected'; then
        dx service ps "$svc" --no-trunc || true
        die "$svc: failed tasks"
      fi
      return 0
    fi
    sleep "$POLL"
  done
  dx service ps "$svc" --no-trunc || true
  die "$svc: timeout"
}

edge() {
  deploy_stack relay_edge "$DIR/stack-edge.yaml"
  wait_svc relay_edge_traefik
}

data() {
  deploy_stack relay_data "$DIR/stack-data.yaml"
  wait_svc relay_data_postgres
  wait_svc relay_data_redis
}

api() {
  [[ -n ${DATABASE_URL:-} && -n ${REDIS_URL:-} ]] || die "DATABASE_URL and REDIS_URL required"
  dx pull "${IMAGE_ROOT}-api:${IMAGE_TAG}"
  deploy_stack relay_api "$DIR/stack-api.yaml"
  wait_svc relay_api_api
}

web() {
  dx pull "${IMAGE_ROOT}-web:${IMAGE_TAG}"
  deploy_stack relay_web "$DIR/stack-web.yaml"
  wait_svc relay_web_web
}

case ${DEPLOY_PHASE:?} in
  provision)
    swarm
    net relay_edge
    net relay_internal
    edge
    data
    ;;
  app)
    swarm
    net relay_edge
    net relay_internal
    : "${SERVICE_NAME:?}"
    case $SERVICE_NAME in api | web) ;; *) die "SERVICE_NAME must be api or web" ;; esac
    [[ -n ${IMAGE_ROOT:-} && -n ${IMAGE_TAG:-} ]] || die "IMAGE_ROOT and IMAGE_TAG required"
    case $SERVICE_NAME in api) api ;; web) web ;; esac
    dx image prune -a -f &>/dev/null || true
    ;;
  *) die "DEPLOY_PHASE must be provision or app (got $DEPLOY_PHASE)" ;;
esac
