# Node Lambda Authorizer 🔗 λ 👮‍♀️

## Table of Contents

- [Overview](#Overview)
- [Setup](#Setup)
- [Usage](#usage)
- [CI](#CI)

## Overview

An authorizer lambda library to use in serverless node.js projects.
This authorizer is based on the authorization service in the [W2-documents-api](https://github.com/LBHackney-IT/w2-document-api), shout-out to @bjpirt @mmmmillar. Built with the intention to reuse this `Authorizer` package across multiple services.

## Setup

1. Run `npm install`
2. Run `npm test` to run all the tests
3. Run `npm run test-coverage` to see the test coverage
4. Run `npm run lint` to run the linter

## Usage

Add the package into your `package.json` file:

```
  "dependencies": {
    "node-lambda-authorizer": "LBHackney-IT/node-lambda-authorizer.git#master"
  },
```

Initialize the service with your secret and user groups in authorizer file e.g: `authorizer.js`

```
const authoriser = require('node-lambda-authorizer'){
    jwtSecret: process.env.JWTSecret,
    allowedGroups: process.env.ALLOWEDGROUP.split(",")
};

exports.handler = authoriser.handler;
```

## CI

- Tests are automated using [GitHub Actions](https://github.com/features/actions) on pull requests
