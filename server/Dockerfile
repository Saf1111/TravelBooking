
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY app.js ./
COPY config ./config

USER node

EXPOSE 5000

CMD ["node", "app.js"]
