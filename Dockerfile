FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@10.33.1

COPY pnpm-lock.yaml package.json ./
RUN pnpm fetch

COPY . .
RUN pnpm install --offline
RUN pnpm run build

EXPOSE 4000
CMD ["node", "dist/index.js"]
