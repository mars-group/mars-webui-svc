#!/usr/bin/env bash

echo "starting development..."

echo "starting npm install..."
npm install

echo "starting bower install..."
bower install

echo "starting the application..."
gulp serve --color
#tail -f /dev/null
