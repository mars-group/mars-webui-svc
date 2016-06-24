#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
        npm install
        bower install --allow-root
        sleep infinity
    else
        gulp
        node server/app.js
    fi
