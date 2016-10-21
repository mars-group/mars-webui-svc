FROM artifactory.mars.haw-hamburg.de:5000/node:argon-slim

ENV NPM_CONFIG_LOGLEVEL warn


#
# Install tool Dependencies
#
# bzip2:  is needed by PhantomJS
RUN apt-get update && apt-get install -y bzip2

# bower:   is the frontend tool for dependencies
# gulp:    builds the frontend, dev, production etc.
RUN npm install -g bower gulp


#
# Add stuff to the container
#
ADD . /app
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

#convert DOS lineendings to UNIX
RUN sed -i $'s/\r$//' /entrypoint.sh


#
# install npm and bower dependencies
#
WORKDIR /app

RUN npm install --only=dev
RUN bower install --allow-root

# build dist (production) directory
RUN gulp

# move prod files to /prod
RUN mkdir /prod && \
  mv server /prod/ && \
  mv dist /prod/ && \
  mv package.json /prod/ && \
  mv .npmrc /prod/


#
# Install production dependencies
#
WORKDIR /prod

RUN npm install --only=production


#
# cleanup
#
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# remove sources
RUN rm -rf /app


#
# run it
#
EXPOSE 3000 3001

ENTRYPOINT ["sh", "/entrypoint.sh"]
