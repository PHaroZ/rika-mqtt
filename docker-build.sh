#!/bin/bash
VERSION=`cat package.json | docker run --rm -i node -e "console.log(JSON.parse(require('fs').readFileSync(0)).version)"`
NAME=`cat package.json | docker run --rm -i node -e "console.log(JSON.parse(require('fs').readFileSync(0)).name)"`
DEFAULT_TAGS="pharoz/${NAME}:${VERSION}"
echo -n "TAGS [${DEFAULT_TAGS}]:"
read TAGS
for TAG in ${TAGS:-${DEFAULT_TAGS}}; do
    docker build -t "$TAG" .
done
