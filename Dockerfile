FROM artifactory.mars.haw-hamburg.de:5000/node:boron-alpine

WORKDIR /app

COPY node_modules_prod/ .
COPY dist/ .
COPY server/ .

EXPOSE 8080

ENTRYPOINT ["node", "server/app.js"]
