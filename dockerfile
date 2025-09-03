FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate


CMD  sh -c "npx prisma migrate dev deploy && npm run start:dev"