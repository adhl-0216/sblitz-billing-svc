FROM node:14 AS builder

WORKDIR /app

COPY ./ ./

RUN npm install

RUN npm run build

FROM node:14 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=builder /app/dist ./dist  

RUN npm install --only=production

EXPOSE 5000

CMD ["npm", "start"]
