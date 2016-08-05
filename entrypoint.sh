#!/usr/bin/env bash

if [ "$DEVELOPER_EDITION" = "true" ]; then
        echo "starting development ..."
        gulp serve --color
#        tail -f /dev/null
    else
        echo "starting production ..."
        gulp --color
        node server/app.js
    fi
