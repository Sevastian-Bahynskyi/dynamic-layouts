#!/bin/bash

find src -name "*.d.ts" -type f -delete
find src -name "*.js" -type f -delete
find . -name "index.js" -type f -delete
find . -name "index.d.ts" -type f -delete
