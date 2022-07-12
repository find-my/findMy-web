# Install dependencies only when needed
FROM node:16.15.0-alpine 

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app



RUN npm install


COPY . /app


RUN npm run build

CMD ["npx", "serve", "-s", "build"]

EXPOSE 3000



