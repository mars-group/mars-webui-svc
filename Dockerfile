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
# Add the code
#
RUN mkdir /app
WORKDIR /app


#
# pull compressed node_modules and bower_components from artifactory
#
RUN curl -u $BAMBOO_USER_PW -O "https://artifactory.mars.haw-hamburg.de/artifactory/compose-script-collection/node_modules.tar.gz"
RUN curl -u $BAMBOO_USER_PW -O "https://artifactory.mars.haw-hamburg.de/artifactory/compose-script-collection/bower_components.tar.gz"

RUN tar xzf node_modules.tar.gz -C /app \
  && tar xzf bower_components.tar.gz -C /app \
  || true


#
# Add Npm and bower files (for caching reasons)
#
ADD package.json /app
ADD .npmrc /app
ADD bower.json /app
ADD .bowerrc /app


#
# Clear old dependencies and install new once
#
RUN npm prune && npm install
RUN bower prune --allow-root --silent && bower install --allow-root --silent


#
# push compressed node_modules and bower_components to artifactory
#
RUN tar -czf node_modules.tar.gz /app/node_modules \
  && tar -czf bower_components.tar.gz /app/bower_components

RUN curl -u $BAMBOO_USER_PW -T node_modules.tar.gz -H "X-Checksum-Sha1:$(shasum node_modules.tar.gz | awk '{print $1}')" "https://artifactory.mars.haw-hamburg.de/artifactory/compose-script-collection/node_modules.tar.gz"
RUN curl -u $BAMBOO_USER_PW -T bower_components.tar.gz -H "X-Checksum-Sha1:$(shasum bower_components.tar.gz | awk '{print $1}')" "https://artifactory.mars.haw-hamburg.de/artifactory/compose-script-collection/bower_components.tar.gz"


#
# build production environment
#

# Add code to the container
ADD . /app

# build production (dist) directory
RUN gulp

RUN mkdir /prod
WORKDIR /prod


#
# Add NPM files to production (for caching reasons)
#
ADD package.json /prod
ADD .npmrc /prod

# Remove development dependencies
RUN npm prune --production

# move files to production directory
RUN mv /app/server /prod/ \
  && mv /app/dist /prod/ \
  && mv /app/node_modules /prod/ \
  && mv /app/package.json /prod/ \
  && mv /app/.npmrc /prod/


#
# cleanup
#
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /app


#
# run it
#
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

#convert DOS lineendings to UNIX
RUN sed -i $'s/\r$//' /entrypoint.sh

# switch workdir for developers
WORKDIR /app

EXPOSE 3000 3001

ENTRYPOINT ["sh", "/entrypoint.sh"]
