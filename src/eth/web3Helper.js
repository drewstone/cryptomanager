import Promise from 'bluebird';

/**
 * Promisified utilities related to Ethereum and Web3
 * @method
 * @param  {Object} web3:       A connected Web3 instance
 * @return {Object}             A set of utility functions
 */
export default function (web3) {
  return new Promise((resolve, reject) => {
    if (!web3) {
      reject('Must pass preconfigured web3 for utilities to work');
    }


    resolve({
      /**
       * Sends a transaction between Ethereum addresses
       * @type {Object}
       * @param {String} from:        Ethereum address of sender
       * @param {String} to:          Ethereum address of receiver
       * @param {Number} value:       Amount of Wei to be sent
       *
       * @return {String}             Transaction hash from Ethereum
       * TODO: Ensure transaction has resolved
       */
      sendTransaction({ from, to, value }) {
        return new Promise((resolve, reject) => {
          web3.eth.sendTransaction({ from, to, value }, (err, txHash) => {
            if (!err) {
              return resolve(txHash);
            }

            return reject(err);
          });
        });
      },

      /**
       * Gets balance of specified address
       * @param {String} address:       Ethereum address
       * @return {Number}               Balance of specified address
       */
      getBalance({ address }) {
        return new Promise((resolve, reject) => {
          return web3.eth.getBalance(address, (err, balance) => {
            if (!err) {
              return resolve(balance.toNumber());
            }

            return reject(err);
          });
        });
      },

      /**
       * Get coinbase of Web3 instance
       * @return {String}               Web3 coinbase address
       */
      getCoinbase() {
        return new Promise((resolve, reject) => {
          web3.eth.getCoinbase((err, coinbase) => {
            if (!err) {
              return resolve(coinbase.toString());
            }

            return reject(err);
          });
        });
      },
    });
  });
}
