#!/bin/bash
set -e

echo "==> Installing dependencies"
yarn install --frozen-lockfile

echo "==> Linting frontend"
yarn workspace @pheme-protocol/web lint

echo "==> Running frontend tests"
yarn workspace @pheme-protocol/web test:ci

echo "==> Running backend tests"
yarn workspace @pheme-protocol/backend test

echo "==> Running smart contract tests"
yarn workspace @pheme-protocol/contracts test

echo "==> All tests and lint checks passed!" 