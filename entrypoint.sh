#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
  echo "starting development ..."

  npm install
  bower install --allow-root

  gulp serve --color
#  tail -f /dev/null

else
  echo "starting production ..."

  cd /prod

  # start server
  node server/app.js

fi
