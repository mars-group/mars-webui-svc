#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
  echo "starting development ..."
  
  echo "starting npm install ..."
  echo "If this is the first time you are starting the app in development it will take a while. Don't panic!"
  npm install

  echo "starting npm install ..."
  bower install --allow-root

  gulp serve --color
#  tail -f /dev/null

else
  echo "starting production ..."

  cd /prod

  # start server
  node server/app.js

fi
