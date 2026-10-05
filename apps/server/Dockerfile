# Dockerfile should be run from the root of the monorepo
# This is necessary to ensure the correct dependencies are installed and package-lock
FROM node:26.9-alpine AS base
# Corepack is no longer bundled with Node 25+; install it explicitly.
RUN npm install -g corepack@latest && corepack enable


FROM base AS builder
WORKDIR /app
COPY . .

# set the node environment: development or production only
ARG NODE_ENV
# deployment stage: local, development, qa, or production (also required at runtime via .env/orchestration)
ARG ENVIRONMENT

ENV CI=true
ENV NODE_ENV=$NODE_ENV
ENV ENVIRONMENT=$ENVIRONMENT

# https://turborepo.com/docs/reference/run#--filter-string
# server... three dots means select all dependencies for the server workspace
RUN pnpm install --filter=server... --frozen-lockfile --ignore-scripts
RUN pnpm --filter=@repo/database exec prisma generate
RUN pnpm --filter=server... build
RUN pnpm --filter=server deploy --prod /out --legacy --ignore-scripts
RUN find . -path '*/node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client' \
    -exec sh -c 'mkdir -p /out/$(dirname "{}") && cp -R "{}" /out/$(dirname "{}")/' \;


FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

# create a non-root user for security
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner
USER runner

COPY --from=builder --chown=runner:runner /out .

EXPOSE 4000
CMD ["node", "dist/main.js"]