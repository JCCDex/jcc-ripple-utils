# jcc-ripple-utils

Toolkit of crossing chain from Ripple to SWTC chain

Toolkit of crossing chain from [Ripple](https://bithomp.com/explorer/) to [SWTC chain](http://www.swtc.top/#/)

![npm](https://img.shields.io/npm/v/jcc-ripple-utils.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc-ripple-utils.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-ripple-utils)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc-ripple-utils/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc-ripple-utils?branch=master)
[![Dependencies](https://img.shields.io/david/JCCDex/jcc-ripple-utils.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-ripple-utils)
[![DevDependencies](https://img.shields.io/david/dev/JCCDex/jcc-ripple-utils.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-ripple-utils?type=dev)
[![npm downloads](https://img.shields.io/npm/dm/jcc-ripple-utils.svg)](http://npm-stat.com/charts.html?package=jcc-ripple-utils)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Description

Transfer token automatically from [Ripple](https://bithomp.com/explorer/) to [SWTC](http://www.swtc.top/#/) chain. Support XRP token.

e.g. you transfer 1 `XRP` to [Ripple Fingate](https://bithomp.com/explorer/rMUpPikgdhmtCida2zf4CMBLrBREfCeYcy) from your ripple address if success, the contract will automatically transfer 1 `JXRP` to your swtc address from [Jingtum Fingate](https://explorec9d536e.jccdex.cn/#/wallet/?wallet=jQs5cAcZrKmyWSQgkmUtXsdeFMzwSYcBA4) in a few minutes.

## Installtion

```shell
npm install jcc-ripple-utils
```

## Usage

```javascript
// demo
import RippleFingate from "jcc-ripple-utils";

// This is a test websocket server. Don't use it in production environment.
const testServer = "wss://t1.ripple.com";

const instance = new RippleFingate(testServer);

const testSecret = "ss8tnkFNue4TZe1MKydL5TYNnz9w4";

const testAddress = "r3sMTxiYm17nDB1nYwGCWd19GJXUrVxuNR";

// Don't change it. The fingate address is it for now.
const destination = "rMUpPikgdhmtCida2zf4CMBLrBREfCeYcy";

const testMemo = {
    jtaddress: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH"
}

const amount = 1;

try {
    // transfer 1 XRP
    await instance.connect();
    const hash = await inst.transfer(testSecret, destination, amount, testMemo);
    console.log(hash);
} catch (error) {
    console.log(error);
} finally {
    instance.disconnect();
}
```
