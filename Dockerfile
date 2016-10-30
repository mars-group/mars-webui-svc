FROM artifactory.mars.haw-hamburg.de:5000/node:argon-slim

ENV NPM_CONFIG_LOGLEVEL silent


#
# Install tool Dependencies
#
# bzip2:  is needed by PhantomJS
# git:    is needed by bower dependency
RUN apt-get update && apt-get install -y bzip2 git

# bower:   is the frontend tool for dependencies
# gulp:    builds the frontend, dev, production etc.
RUN npm install -g bower gulp


#
# install npm and bower dependencies
#
RUN mkdir /app
RUN mkdir /prod

# Add the files seperately, so docker can cache them
ADD package.json /app
ADD .npmrc /app
ADD bower.json /app

ADD package.json /prod
ADD .npmrc /prod


#
# install dev dependencies
#
WORKDIR /app

RUN npm install --only=dev
RUN bower install --allow-root


#
# build production
#
# Add code to the container
ADD . /app

# build dist (production) directory
RUN gulp


#
# Install production dependencies
#
WORKDIR /prod

RUN npm install --only=production

# move prod files to /prod
RUN mv /app/server /prod/ && \
  mv /app/dist /prod/


#
# cleanup
#
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /app


#
# run it
#
#convert DOS lineendings to UNIX
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh
RUN sed -i $'s/\r$//' /entrypoint.sh

EXPOSE 3000 3001

ENTRYPOINT ["sh", "/entrypoint.sh"]
