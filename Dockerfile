#Comando completo dockerfile:
# docker run -p 3000:3333 -e DATABASE_URL="postgresql://test" -e CLOUDFLARE_ACCOUNT_ID="#" -e CLOUDFLARE_ACCESS_KEY_ID="#" -e CLOUDFLARE_SECRET_ACCESS_KEY="#" -e CLOUDFLARE_BUCKET="#" -e CLOUDFLARE_PUBLIC_URL="http://localhost" -d brevly-server-test:v2
FROM node:22.16.0 AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY tsup.config.ts ./tsup.config.ts

RUN pnpm build
RUN pnpm prune --prod 

FROM node:22.16.0-alpine AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist/drizzle.config.js ./drizzle.config.js
COPY --from=build /usr/src/app/src/infra/db/migrations ./dist/infra/db/migrations

EXPOSE 3333  

CMD ["node", "dist/infra/http/server.js"]