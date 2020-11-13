# eIDAS Bridge API

> SSI eIDAS Bridge API service linking the European Trust and Legal Framework, named eIDAS (electronic IDentification, Authentication and trust Services), with the Self-Sovereign Identification (SSI) global trust framework, based on Decentralized Identifiers, or DIDs.

## Table of Contents

1. [Getting started](#Getting)
2. [Building](#Building)
3. [Testing](#Testing)
4. [Swagger Documentation](#Swagger-Documentation)
5. [Licensing](#Licensing)

## Getting started

### Prerequisites

You need:

- Node.js >= 12
- Yarn >= 1.22.0

### Installing

Clone the repository and move to the project directory

```sh
git clone https://github.com/validatedid/ssi-eidas-bridge
cd ssi-eidas-bridge
```

#### Docker Build and Up

Copy `.env.example` to `.env` and set the following environment variables:

- `BRIDGE_ENV` : set to test, local, integration, development or production
- `API_PRIVATE_KEY` <-- TYPE HERE API PRIVATE KEY IN HEX FORMAT

Build and Run ssi-eidas-bridge Docker Image

```sh
docker-compose up --build
```

To stop the container, just press `Ctrl^C` and to remove the container:

```sh
docker-compose down
```

## Building

Clone the repository and move to the project directory

```sh
git clone https://github.com/validatedid/ssi-eidas-bridge
cd ssi-eidas-bridge
```

Install the required libraries and packages dependencies

```sh
yarn install
```

Build project

```sh
yarn build
```

Start the swagger service API

```sh
yarn start
```

This command starts a node server exposing the SSI eIDAS Bridge Swagger API at <http://localhost:9000/ssi-eidas-bridge/v1/api-docs/> where you can play with the API.

## Testing

Copy .env.example to .env and set the following environment variables:

- `BRIDGE_ENV` : set to test, local, integration, development or production
- `API_PRIVATE_KEY` <-- TYPE HERE API PRIVATE KEY IN HEX FORMAT

### Unit tests

Run:

```sh
yarn test:unit
```

### Functional tests

Run:

```sh
yarn test:e2e
```

### Unit & Integration tests

Run:

```sh
yarn test
```

## Swagger Documentation

This project contains the SSI eIDAS Bridge Service,linking the European Trust and Legal Framework, named eIDAS (electronic IDentification, Authentication and trust Services), with the Self-Sovereign Identification (SSI) global trust framework, based on Decentralized Identifiers, or DIDs.

You can read the documentation at <https://api.vidchain.net/ssi-eidas-bridge/v1/api-docs>.
