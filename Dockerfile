# Install dependencies only when needed
FROM node:16.15.0-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./ 

RUN npm install


COPY . .


RUN npm run build

EXPOSE 3000



