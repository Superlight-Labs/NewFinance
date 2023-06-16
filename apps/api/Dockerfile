# Install Turbo and Prune
FROM amd64/node:16 AS builder

WORKDIR /app
RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=@superlight-labs/api --docker


# Install Dependencies and Node Modules
FROM amd64/node:16 AS installer

RUN apt-get update
RUN apt-get --yes install python3 \
        make \
        g++


WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn turbo run build --filter=@superlight-labs/api...

# Setup Process and run command
FROM amd64/node:16 AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 superlight-api
RUN adduser --system --uid 1001 superlight-api
USER superlight-api

COPY --from=installer /app .

EXPOSE 8080

CMD yarn workspace @superlight-labs/api start