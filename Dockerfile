# Install dependencies only when needed
FROM node-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json /app 

RUN npm install


COPY . /app


RUN npm run build

CMD ["npx", "serve", "-s", "build"]

EXPOSE 3000



