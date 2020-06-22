#!/bin/sh

docker-compose \
	--env-file .env \
	--file ./docker-compose.dev.yml \
	--file ./docker-compose.local.yml \
	run --rm "$@"
