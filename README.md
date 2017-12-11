# WebUI

Maintainer: Lennart @abv081

See [MARS Confluence](https://confluence.mars.haw-hamburg.de/display/WALK/WebUI)

## Deprecated
This project is not in active development anymore. Please check out the [teachingui](https://gitlab.informatik.haw-hamburg.de/mars/mars-teachingui-svc).

## Development Dockerfile build (UNIX)
**This part is maintained by Janus and it will not allow you to connect to other services.**

Open your favorite Terminal and run these commands in repo root folder:

```sh
$ docker build -t web-ui-dev:01 -f Dockerfile_dev .
```
```sh
$ docker run -it -p 8080:8080 -v $(pwd):/app web-ui-dev:01
```
