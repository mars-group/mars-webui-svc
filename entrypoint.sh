#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
        echo "starting development ..."
        echo "Use 'docker-compose -f develop exec frontend bash' to connect to container and run 'gulp serve --color'!"
        echo "If you don't want to develop on the frontend, set 'DEVELOPER_EDITION' to false inside 'development.yml'."
#        tail -f /dev/null
        gulp serve --color
    else
        echo "starting production ..."
        gulp
        node server/app.js
    fi
