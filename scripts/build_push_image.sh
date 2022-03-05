#!/bin/bash

DOCKER_PATH=$1

docker buildx build --platform linux/amd64 "$DOCKER_PATH" -t siwakorn21/wappalyzer-server:latest
docker push siwakorn21/wappalyzer-server:latest
