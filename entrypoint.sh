#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
        echo "starting development ..."
        echo "running! use 'docker-compose -f develop exec frontend bash' to connect to container and run 'gulp serve --color' inside!"
        echo "If you don't want to develop on the frontend, set 'DEVELOPER_EDITION' to false inside 'development.yml'."
        tail -f /dev/null
    else
        echo "starting production ..."
        gulp
        node server/app.js
    fi
