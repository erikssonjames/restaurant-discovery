FROM node:22-alpine AS builder

RUN apk add --no-cache \
    build-base \
    python3 \
    vips-dev

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner

RUN apk add --no-cache vips

WORKDIR /opt/app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

COPY --from=builder --chown=node:node /opt/app ./

USER node

EXPOSE 1337

CMD ["npm", "run", "start"]