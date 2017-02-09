#!/usr/bin/env bash

echo "starting development..."

echo "starting yarn install..."
npm install --warn phantomjs-prebuilt # workaround for phantomJS being stupid
yarn install --force --no-progress

echo "starting bower install..."
bower install

echo "starting the application..."
gulp serve --color
#tail -f /dev/null
