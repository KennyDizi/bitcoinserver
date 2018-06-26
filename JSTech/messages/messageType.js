'use strict';

let constants = {
    hello: 1001,
    helloReply: 1002,
    key3: {
        subkey1: "subvalue1",
        subkey2: "subvalue2"
    },
    saveWallet: 1003,
    saveWalletReply: 1004,
    transactionHistory: 1005,
    transactionHistoryReply: 1006
};

module.exports = Object.freeze(constants); // freeze prevents changes by users