#!/bin/bash
npm run build
npx babel node_modules/ripple-lib/dist/npm --out-dir node_modules/ripple-lib/dist/npm
npx babel node_modules/ripple-lib-transactionparser/src --out-dir node_modules/ripple-lib-transactionparser/src
npx babel ./node_modules/swtc-factory --out-dir ./node_modules/swtc-factory
npx babel ./node_modules/swtc-keypairs --out-dir ./node_modules/swtc-keypairs
npx babel ./node_modules/swtc-chains --out-dir ./node_modules/swtc-chains
npx babel ./node_modules/swtc-address-codec --out-dir ./node_modules/swtc-address-codec
./node_modules/cross-env/dist/bin/cross-env-shell.js MODE=$1 REPORT=$2 webpack

# ./compile.sh dev true
# ./compile.sh prod true


