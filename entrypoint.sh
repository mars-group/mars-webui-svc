#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then

  echo "starting development ..."

  npm install
  bower install --allow-root

  gulp serve --color
#  tail -f /dev/null

else
  echo "starting production ..."

  # build dist
  gulp

  # move prod files
  mkdir /prod
  cd /prod
  mv /app/server .
  mv /app/dist .
  mv /app/package.json .

  # install production dependencies
  npm install --only=production

  # remove sources
  rm -rf /app

  # start server
  node server/app.js

fi
