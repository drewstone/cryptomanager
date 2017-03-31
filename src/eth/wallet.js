import Promise from 'bluebird';
import { keystore, txutils, signing } from 'eth-lightwallet';

/**
 * Signs a transaction given a Keystore and Password Derived key
 * @method signTx
 * @param  {String} address:      Sending/originating address of transaction
 * @param  {Object} txData:       Transaction data formatted for Ethereum
 * @param  {Object} ks:           Keystore from eth-lightwallet
 * @param  {Object} pwDerivedKey: Password derived key
 * @return {Object}               Signed transaction
 */
export const signTransaction = ({ address, txData, ks, pwDerivedKey }) => {
  const transaction = Object.assign({}, txData);
  transaction.gasPrice = parseInt(txData.gasPrice, 16);
  transaction.nonce = parseInt(txData.nonce, 16);
  transaction.gasLimit = txData.gas;
  const tx = txutils.createContractTx(address, transaction);
  return signing.signTx(ks, pwDerivedKey, tx.tx, address);
};

/**
 * Generates key information for new Ethereum wallets
 * @method generateKeyInformation
 * @param  {String} password:       Temporary password for encrypting keystore
 * @return {String}                 Keystore, pwDerivedKey, and mnemonic
 */
export const generateKeyInfo = ({ password, seedPhrase }) => {
  return createVault({ password, seedPhrase })
  .then(({ ks, pwDerivedKey, address }) => {
    return Promise.props({
      address: Promise.resolve(address),
      mnemonic: ks.getSeed(pwDerivedKey),
      ks: Promise.resolve(ks),
      pwDerivedKey: Promise.resolve(pwDerivedKey),
    });
  });
};

/**
 * Creates a new/old keystore from provided arguments
 * @method createVault
 * @param  {String} password:       Temporary password for encrypting keystore
 * @param  {String} seedPhrase:     Optional mnemonic code for recovering wallet
 * @return {Object}                 Keystore for wallet
 */
export const createVault = ({ password, seedPhrase, keystoreString }) => {
  const opts = (seedPhrase) ? { password, seedPhrase } : { password };
  return new Promise((resolve, reject) => {
    if (!seedPhrase && keystoreString) {
      return resolve(keystore.deserialize(keystoreString));
    }

    // eslint-disable-next-line consistent-return
    return keystore.createVault(opts, (err, ks) => {
      if (err) {
        return reject(err);
      }

      if (ks.getAddresses().length === 0) {
        keyFromPassword({ ks, password })
        .then(({ pwDerivedKey }) => {
          ks.generateNewAddress(pwDerivedKey, 1);
          return resolve({
            ks,
            pwDerivedKey,
            address: ks.getAddresses().map(addr => `0x${addr}`)[0],
          });
        });
      }
    });
  });
};

/**
 * Validates a 12 string mnemonic code
 * @method validateMnemonic
 * @param  {String} mnemonic:       12 string mnemonic code
 * @return {Boolean}
 */
export const validateMnemonic = ({ mnemonic }) => {
  return (mnemonic) ? mnemonic.split(' ').length === 12 : false;
};

/**
 * Generates Password Derived key for signing transactions from a Keystore
 * @method keyFromPassword
 * @param  {Object} ks:             Keystore from eth-lightwallet
 * @param  {String} password:       Temporary password for encrypting keystore
 * @return {Object}                 Keystore and Password Derived key
 */
const keyFromPassword = ({ ks, password }) => new Promise((resolve, reject) => {
  ks.keyFromPassword(password, (err, pwDerivedKey) => {
    if (!err) {
      return resolve({ ks, pwDerivedKey });
    }

    return reject(err);
  });
});
