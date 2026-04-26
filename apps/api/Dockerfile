# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS pruner

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm dlx turbo prune api --docker

FROM base AS builder

COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm fetch --frozen-lockfile \
  && pnpm install --frozen-lockfile --prefer-offline

COPY --from=pruner /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

ENV NODE_ENV=production

RUN pnpm exec turbo run check-types build --filter=api...

FROM builder AS deployer

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm --filter api --prod deploy /deploy --no-optional

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs -G nodejs -H

USER nestjs

COPY --from=deployer --chown=nestjs:nodejs /deploy/ .

EXPOSE 3000/tcp

CMD [ "node", "dist/main.js" ]
