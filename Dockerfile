# Install dependencies only when needed
FROM node:16.15.0-alpine 




RUN npm install


RUN npm run build

CMD ["npx", "serve", "-s", "build"]

EXPOSE 3000



