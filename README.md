# Job Board Sample Application

## Prerequisites

- Docker + Docker-compose
- [Node Version Manager](https://github.com/nvm-sh/nvm)

## Setup Dev Environment

Copy example .env

```bash
cp .env.example .env
```

Install NodeJS

```bash
nvm install node # installs latest nodejs version
node -v > .nvmrc # saves current nodejs version for later use
nvm use # loads and uses saved nodejs version
npm install # installs nodejs packages
```

## Running apps + services with docker-compose

```bash
docker-compose up # starts all apps and services
```

## Running the services with docker-compose

```bash
docker-compose up elasticsearch postgres redis # starts all services
```

## Running the apps natively

```bash
# development
$ SERVICE_NAME=<service-name> npm run start

# watch mode
$ SERVICE_NAME=<service-name> npm run start:dev

# production mode
$ SERVICE_NAME=<service-name> npm run start:prod
```

HINT: SERVICE_NAMES= `jobs | gateway | search` (e.g. `SERVICE_NAME=jobs npm run start:dev`)

## Testing

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

# Service-only e2e tests
$ SERVICE_NAME=<service-name> npm run test:e2e
```
