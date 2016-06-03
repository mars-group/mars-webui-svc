#!/usr/bin/env bash

npm install
bower install --allow-root

if [ "$DEVELOPER_EDITION" = "true" ]; then
        gulp
    else
        gulp --production
    fi
