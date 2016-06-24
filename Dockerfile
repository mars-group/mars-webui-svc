FROM artifactory.mars.haw-hamburg.de:5000/debian:jessie

# bzip2 is needed by PhantomJS and git for bower dependencies
RUN apt-get update && apt-get install -y curl bzip2 git

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get update && apt-get install -y nodejs

RUN npm install -g foundation-cli bower gulp

# cleanup apt caches packages
RUN rm -rf /var/lib/apt/lists/*

ADD . /app
WORKDIR /app
RUN chmod +x entrypoint.sh

RUN npm install && bower install --allow-root

EXPOSE 3000 3001

ENTRYPOINT ["sh", "entrypoint.sh"]
