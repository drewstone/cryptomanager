import Promise from 'bluebird';
import Web3 from 'web3';
import Provider from './provider';
import Web3Helper from './web3Helper';
import * as Wallet from './wallet';
import * as StorageHelper from '../storageHelper';

export const createWallet = ({ password, path, name, options = {} }) => {
  // Generate key data
  const opts = (options.seedPhrase) ? { password, seedPhrase: options.seedPhrase } : { password };
  return Wallet.generateKeyInfo(opts)
  .then(({ ks, pwDerivedKey, mnemonic, address }) => {
    const data = ks.serialize();

    // Save serialized key data
    return StorageHelper.save({ path, name, data, options })
    .then(() => ({ ks, pwDerivedKey, mnemonic, address }));
  });
};

export const connectToEthereum = ({ wallet, url }) => {
  if (!wallet) {
    return Promise.reject('Must pass in wallet: Use "createNewWallet" to create a new Ethereum wallet');
  }

  const { ks, pwDerivedKey } = wallet;
  const address = ks.getAddresses()[0];
  const engine = Provider({
    rpcUrl: url,
    getAccounts: (callback) => {
      return callback(null, ks.getAddresses());
    },
    approveTransaction: (txData, callback) => {
      return callback(null, true);
    },
    signTransaction: (txData, callback) => {
      return Wallet.signTransaction({ address, txData, ks, pwDerivedKey })
      .then(signed => callback(null, signed));
    },
  });

  const web3 = new Web3(engine);
  return new Promise((resolve, reject) => {
    web3.net.getListening((err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve({ web3 });
    });
  });
};

export const getWalletInterface = ({ web3 }) => {
  return Web3Helper({ web3 })
  .then(({ sendTransaction, sendCall, getBalance, getCoinbase }) => ({
    send: ({ to, value }) => {
      return getCoinbase()
      .then((addr) => (sendTransaction({ from: addr, to, value })));
    },
    call: ({ address, functionName, args }) => {
      return Promise.reject('Unimplemented');
    },
    transact: ({ address, functionName, args }) => {
      return Promise.reject('Unimplemented');
    },
  }));
};
