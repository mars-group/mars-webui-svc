FROM artifactory.mars.haw-hamburg.de:5000/node:boron-alpine

WORKDIR /app

COPY node_modules_prod/ node_modules
COPY dist/ dist
COPY server/app.js .

EXPOSE 8080

ENTRYPOINT ["node", "app.js"]
