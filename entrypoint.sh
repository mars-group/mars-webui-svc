#!/usr/bin/env bash

echo "starting development ..."

echo "starting npm install ..."
npm install

echo "starting npm install ..."
bower install

gulp serve --color
#  tail -f /dev/null
