FROM nexus.informatik.haw-hamburg.de/node:boron-alpine

WORKDIR /app

COPY node_modules_prod/ node_modules
COPY dist/ dist
COPY server/ server

EXPOSE 8080

ENTRYPOINT ["node", "server/app.js"]
