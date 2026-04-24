HOST_UID := $(shell id -u)
HOST_GID := $(shell id -g)

DOCKER_COMPOSE_EDGE := docker compose --env-file .env.local -f compose.edge.yaml
DOCKER_COMPOSE := HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose --env-file .env.local -f compose.yaml
DOCKER_COMPOSE_DEV := $(DOCKER_COMPOSE) --profile dev
DOCKER_COMPOSE_PREVIEW := $(DOCKER_COMPOSE) --profile preview

.PHONY: ensure-edge
ensure-edge:
	$(DOCKER_COMPOSE_EDGE) up -d

.PHONY: edge-stop
edge-stop:
	$(DOCKER_COMPOSE_EDGE) stop

.PHONY: edge-down
edge-down:
	$(DOCKER_COMPOSE_EDGE) down --remove-orphans

.PHONY: up
up: ensure-edge
	$(DOCKER_COMPOSE_DEV) up

.PHONY: up-d
up-d: ensure-edge
	$(DOCKER_COMPOSE_DEV) up -d

.PHONY: stop
stop:
	$(DOCKER_COMPOSE_DEV) stop

.PHONY: down
down:
	$(DOCKER_COMPOSE_DEV) down --volumes --remove-orphans

.PHONY: rmi
rmi:
	$(DOCKER_COMPOSE_DEV) down --volumes --remove-orphans --rmi all

.PHONY: preview-up
preview-up: ensure-edge
	$(DOCKER_COMPOSE_PREVIEW) up

.PHONY: preview-up-d
preview-up-d: ensure-edge
	$(DOCKER_COMPOSE_PREVIEW) up -d

.PHONY: preview-stop
preview-stop:
	$(DOCKER_COMPOSE_PREVIEW) stop

.PHONY: preview-down
preview-down:
	$(DOCKER_COMPOSE_PREVIEW) down --volumes --remove-orphans

.PHONY: preview-rmi
preview-rmi:
	$(DOCKER_COMPOSE_PREVIEW) down --volumes --remove-orphans --rmi all
