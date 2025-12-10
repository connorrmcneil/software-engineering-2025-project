# install dependencies
FROM oven/bun:latest
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY packages/api/package.json ./package.json
COPY packages/api/prisma/schema.prisma ./prisma/schema.prisma

RUN bun install --production

COPY packages/api/prisma/migrations ./prisma/migrations
COPY packages/api/dist/server.js ./dist/server.js
COPY packages/front-end/dist ./client

ENTRYPOINT ["bun", "run", "start"]
