#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
  echo "starting development ..."

  echo "starting npm install ..."
  npm install

  echo "starting npm install ..."
  bower install

  gulp serve --color
#  tail -f /dev/null

else
  echo "starting production ..."

  cd /prod

  # start server
  node server/app.js

fi
