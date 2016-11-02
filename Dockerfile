FROM artifactory.mars.haw-hamburg.de:5002/frontend_base

# Add Npm and bower files (for caching reasons)
ADD package.json /app
ADD .npmrc /app
ADD bower.json /app
ADD .bowerrc /app
ADD package.json /prod
ADD .npmrc /prod

# Install development Dependencies
WORKDIR /app
RUN npm install --only=dev
RUN bower install --allow-root --silent

# Install production Dependencies
WORKDIR /prod
RUN npm install --production

# Add code to the container
ADD . /app
WORKDIR /app

# Build production (dist) directory
RUN gulp

# Move files to production directory
RUN mv /app/server /prod \
  && mv /app/dist /prod

# Cleanup
RUN rm -rf /app

# Add entrypoint
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

# Convert DOS lineendings to UNIX
RUN sed -i $'s/\r$//' /entrypoint.sh

# Switch workdir for developers
WORKDIR /app
