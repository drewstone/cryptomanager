import Promise from 'bluebird';
import Web3 from 'web3';
import Provider from './provider';
import Web3Helper from './web3Helper';
import * as Wallet from './wallet';
import * as StorageHelper from '../storageHelper';


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
  return Web3Helper(web3);
};

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
