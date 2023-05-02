# Stage 1 - Create yarn install skeleton layer
FROM node:16-bullseye-slim AS packages

WORKDIR /app
COPY package.json yarn.lock ./
COPY packages packages
COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

# Stage 2 - Install dependencies and build packages
FROM node:16-bullseye-slim AS build
#USER node
WORKDIR /app
COPY --from=packages /app . 
# --chown=node:node /app .

ENV CYPRESS_INSTALL_BINARY=0

# install sqlite3 dependencies
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
    yarn config set python /usr/bin/python3

RUN yarn install --prefer-offline --frozen-lockfile --network-timeout 60000 && rm -rf "$(yarn cache dir)"
# RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
#     yarn install --frozen-lockfile --network-timeout 60000

COPY . .

RUN yarn tsc
RUN yarn --cwd packages/backend build

# RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
#     && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
#     && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Build the actual backend image and install production dependencies
FROM node:16-bullseye-slim
#USER node
WORKDIR /app

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
    yarn config set python /usr/bin/python3
# Copy the install dependencies from the build stage and context
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz
# RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
#     yarn install --frozen-lockfile --production --network-timeout 600000

COPY --from=build --chown=node:node /app/packages/backend/dist/bundle.tar.gz ./
COPY --chown=node:node app-config.yaml ./

#ENV NODE_ENV production
#RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# Copy any other files that we need at runtime
#COPY --chown=node:node app-config.yaml ./

CMD ["node", "packages/backend", "--config", "app-config.yaml"]
