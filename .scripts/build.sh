#!/usr/bin/env bash
docker run -v `pwd`:/usr/src/app -it --rm node:8 /bin/bash -c "cd /usr/src/app; npm install; npm run build;"