FROM artifactory.mars.haw-hamburg.de:5000/node:argon-slim

ENV NPM_CONFIG_LOGLEVEL warn

# bzip2           is needed by PhantomJS
RUN apt-get update && apt-get install -y bzip2

# bower   is the frontend tool for dependencies
# gulp    builds the frontend, dev, production etc.
RUN npm install -g bower gulp

# cleanup apt caches
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD . /app
WORKDIR /app
RUN chmod +x entrypoint.sh

RUN npm install
RUN bower install --allow-root

EXPOSE 3000 3001

ENTRYPOINT ["sh", "entrypoint.sh"]
