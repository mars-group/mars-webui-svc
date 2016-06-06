#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
        npm install
        bower install --allow-root
        gulp
    else
        gulp build --production
        node server.js
    fi
