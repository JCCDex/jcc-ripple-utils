#!/bin/bash
npm run build
npx babel node_modules/ripple-lib/dist/npm --out-dir node_modules/ripple-lib/dist/npm
npx babel node_modules/ripple-lib-transactionparser/src --out-dir node_modules/ripple-lib-transactionparser/src

./node_modules/cross-env/dist/bin/cross-env-shell.js MODE=$1 REPORT=$2 webpack

# ./compile.sh dev true
# ./compile.sh prod true


