# cryptomanager
cryptomanager is a wrapper on top of Ethereum and eventually other cryptocurrencies. The goal is to provide access to cryptocurrency utilities (wallets) and the crytocurrency networks for client and server side applications.

## Usage
```javascript
import Crypto from 'cryptomanager';
const { Eth } = Crypto;
```
### Creating a wallet
```javascript
Eth.createWallet({
   password: /* Enter a password to encrypt wallet locally */ ,
   path: /* Enter a path to store the wallet */,
})
.then(({ ks, pwDerivedKey, mnemonic }) => {
  // Use ks, pwDerivedKey, mnemonic for wallet functionality
  // These variables are specific to 'eth-lightwallet'
  return ks.getAddresses();
});
```
### Connecting to Ethereum
```javascript
Eth.connectToEthereum({
  // Uses keystore & pw for address generation
  wallet: { ks, pwDerivedKey },
  url: /* Ethereum node location/address */
})
.then(({ sendTransaction, getBalance, getCoinbase}) => {
  //  Promisified web3 utils
  return getBalance({ address: '0x9de99a05a1f9a73bf02600deac7ccc227ce07cd9'})
});
```

# API
## Eth
### Eth.createWallet({ password, path, name, options }) -> ***Promise:`({ ks, pwDerivedKey, mnemonic })`***
- `password` {String}: Temporary password for encrypting keystore while in use ***(required)***
- `path` {String}: Path to store wallet ***(required)***
- `name` {String}: Name of wallet/file to store ***(default: 'wallet.json')***
- `options` {Object}: An object specifying device type (mobile for now) and other extra configuration parameters ***(default: {})***
  - `options.mobile` {Boolean}: Check if using on mobile devices (for `react-native` specifically)
  - `options.seedPhrase` {String}: 12 string mnemonic used to restore existent Ethereum wallet
### Eth.connectToEthereum({ wallet, url }) -> ***Promise:`({ web3 })`***
- `wallet` {Object}: Wallet state ***(required)***
  - `wallet.ks` {Object}: Wallet keystore ***(required)***
  - `wallet.pwDerivedKey` {Uint8Array}: Password derived key for authenticating wallet actions ***(required)***
- `url` {String}: RPC url for Ethereum node ***(default: 'https://mainnet.infura.io/')***
### Eth.getWalletInterface({ web3 }) -> ***Promise:`({ send, call, transact })`***
- `web3` {Object}: Connected Web3 instance through `web3-provider-engine` ***(required)***