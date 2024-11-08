FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run build

FROM node:14 AS production

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=builder /app/dist ./dist  

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]
