#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
  echo "starting development ..."

  npm install
  bower install --allow-root

  gulp serve --color
#  tail -f /dev/null

else
  echo "starting production ..."

  if [ -f package.json ]; then
    # build dist
    gulp

    # move prod files
    mkdir /prod
    mv server /prod/
    mv dist /prod/
    mv package.json /prod/
    mv .npmrc /prod/

    # remove sources
    find . ! -name "entrypoint.sh" -exec rm -rf {} \;

    cd /prod

    # install production dependencies
    npm install --only=production

  else
    cd /prod

  fi

  # start server
  node server/app.js

fi
