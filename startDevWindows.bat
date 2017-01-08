#!/usr/bin/env bash
docker run -e "DEVELOPER_EDITION=true" -v F:\Softwareprojekte\marscloud\mars-websuite-frontend\entrypoint.sh:/entrypoint.sh -v F:\Softwareprojekte\marscloud\mars-websuite-frontend:/app -p 8080:8080 artifactory.mars.haw-hamburg.de:5002/webui-svc_master
