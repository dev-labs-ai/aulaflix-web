# The web's image: the Nitro server that `nuxt build` writes to .output/, run with Node as the unprivileged node user.
# aulaflix-api's Compose `full` profile runs it and relies on three things: the server listens on port 3000, the image
# has sh, and `node .output/server/index.mjs` starts it from the working directory. Its entrypoint wraps that command
# to read the BFF key from a secret file first.
# Secrets are never part of the image: they arrive at run time as NUXT_* variables.

# The build: pnpm and the full dependency tree, which never reach the runtime image
FROM node:24.21.0-alpine3.24 AS build
WORKDIR /build
# Corepack runs the pnpm version that package.json pins in packageManager
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# The dependencies first, in a layer of their own. pnpm fetch reads only the lockfile, so a source-only change reuses
# this layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --frozen-lockfile

# The checks and the e2e tests run in CI, not here. @nuxt/fonts downloads the fonts during the build, so this step
# needs network access.
COPY . .
RUN pnpm install --offline --frozen-lockfile && pnpm build

# The runtime: Node and .output alone, which bundles the server's dependencies and the public assets. The files stay
# owned by root, so the server can't modify them.
FROM node:24.21.0-alpine3.24
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /build/.output .output
USER node

EXPOSE 3000
# Exec form, so Node is PID 1 and receives SIGTERM. Nitro handles it, and lets the requests in flight finish, for
# 30 seconds at most (NITRO_SHUTDOWN_TIMEOUT).
ENTRYPOINT ["node", ".output/server/index.mjs"]
