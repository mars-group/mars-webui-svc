# WebUI

Maintainer: Lennart @abv081

### Development Dockerfile build (UNIX)
Open your favorite Terminal and run these commands in repo root folder:

```sh
$ docker build -t web-ui-dev:01 -f Dockerfile_dev .
```
```sh
docker run -it -p 8080:8080 -e "DEVELOPER_EDITION=true" -v $(pwd)/entrypoint.sh:/app/entrypoint.sh -v $(pwd):/app web-ui-dev:01
```