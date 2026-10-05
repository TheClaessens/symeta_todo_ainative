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
# deployment stage: local, development, qa, or production
ARG ENVIRONMENT
# set the backend url for the client to connect to
ARG VITE_BACKEND_URL

ENV CI=true
ENV NODE_ENV=$NODE_ENV
ENV ENVIRONMENT=$ENVIRONMENT
ENV VITE_ENVIRONMENT=$ENVIRONMENT
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# https://turborepo.com/docs/reference/run#--filter-string
# client... three dots means select all dependencies for the client workspace
RUN pnpm install --filter=client... --frozen-lockfile --ignore-scripts
RUN pnpm --filter=client... build
RUN pnpm --filter=client deploy --prod /out --legacy --ignore-scripts


FROM base AS runner
WORKDIR /app

RUN npm i -g serve

# create a non-root user for security
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner
USER runner

COPY --from=builder --chown=runner:runner /out /app

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
