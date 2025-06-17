#!/bin/bash

cd layers/libsql
pnpm install
cp -r node_modules nodejs
zip -r libsql_layer.zip nodejs