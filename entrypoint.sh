#!/usr/bin/env bash

echo "starting development..."

echo "starting yarn install..."
yarn install --no-progress

echo "starting bower install..."
bower install

echo "starting the application..."
gulp serve --color
#tail -f /dev/null
