FROM artifactory.mars.haw-hamburg.de:5000/debian:jessie

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

RUN apt-get update && apt-get install -y ruby nodejs git
RUN gem install bundler
RUN npm install -g foundation-cli bower gulp

ADD . /app
WORKDIR /app
RUN chmod +x entrypoint.sh

RUN npm install && bower install --allow-root

EXPOSE 80 35729

ENTRYPOINT ["sh", "entrypoint.sh"]
