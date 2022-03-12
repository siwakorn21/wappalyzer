#!/bin/bash

DOCKER_PATH=$1

docker buildx build --platform=linux/amd64,linux/arm64,linux/x86_64 "$DOCKER_PATH" -t siwakorn21/wappalyzer-server:latest
docker push siwakorn21/wappalyzer-server:latest
