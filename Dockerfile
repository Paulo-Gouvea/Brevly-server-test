FROM node:22.16.0 AS base
# FROM node:22.16.0-alpine

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN pnpm build
RUN pnpm prune --prod 

FROM gcr.io/distroless/nodejs22-debian12 AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

ENV DATABASE_URL="postgresql://test"
ENV CLOUDFLARE_ACCOUNT_ID="#"
ENV CLOUDFLARE_ACCESS_KEY_ID="#"
ENV CLOUDFLARE_SECRET_ACCESS_KEY="#"
ENV CLOUDFLARE_BUCKET="#"
ENV CLOUDFLARE_PUBLIC_URL="http://localhost"

# depois trocar o 3333 pela env var!!!!!!
EXPOSE 3333  

CMD ["dist/infra/http/server.js"]