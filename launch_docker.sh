#!/bin/sh
# launch_docker.sh
set -ex

# Stop and remove any existing containers with the same name
docker rm -f shloball &>/dev/null

# Build the Docker image
docker build -t shloball .

# Run the Docker container
docker run -ti --rm \
  --name shloball \
  -p 3000:3000 \
  shloball
