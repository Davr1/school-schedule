# How to run this under a docker container

Please use docker compose. The dockerfile is only for building the image...

## Available compose files:

-   Default: `docker-compose.yml`
-   Tor: `tor.docker-compose.yml`
<!-- -   Development: `dev.docker-compose.yml` -->

## How to compose them

### The default configuration

This one must be always specified, it's the base configuration.

```sh
docker compose -f docker/docker-compose.yml up -d --build
```

### The tor configuration

Use tor as a proxy for outgoing connections (doesn't accept incoming connections)

```sh
docker compose -f docker/docker-compose.yml -f docker/tor.docker-compose.yml up -d --build
```

<!--
Nothing to see here, :/

### The development configuration

This doesn't run a development build, it only makes the app always available and doesn't restart on failure.

```sh
docker compose -f docker/docker-compose.yml -f docker/dev.docker-compose.yml up -d --build
```

### The development configuration with tor

The order of the compose files is important!

```sh
docker compose -f docker/docker-compose.yml -f docker/tor.docker-compose.yml -f docker/dev.docker-compose.yml up -d --build
```
-->
