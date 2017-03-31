# cryptomanager
cryptomanager is a wrapper on top of Ethereum and eventually other cryptocurrencies. The goal is to provide access to cryptocurrency utilities (wallets) and the crytocurrency networks for client and server side applications.

## Usage
```javascript
import Crypto from 'cryptomanager';
const { Eth } = Crypto;
```

# API
## Eth
### **Eth.createWallet({ password, path, name, options })**
#### -> ***Promise:`({ ks, pwDerivedKey, mnemonic })`***
- `password` {String}: Temporary password for encrypting keystore while in use ***(required)***
- `path` {String}: Path to store wallet ***(required)***
- `name` {String}: Name of wallet/file to store ***(default: 'wallet.json')***
- `options` {Object}: An object specifying device type (mobile for now) and other extra configuration parameters ***(default: {})***
  - `options.mobile` {Boolean}: Check if using on mobile devices (for `react-native` specifically)
  - `options.seedPhrase` {String}: 12 string mnemonic used to restore existent Ethereum wallet
### *Usage*
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
-- -
### **Eth.connectToEthereum({ wallet, url })**
#### -> ***Promise:`({ web3 })`***
- `wallet` {Object}: Wallet state ***(required)***
  - `wallet.ks` {Object}: Wallet keystore ***(required)***
  - `wallet.pwDerivedKey` {Uint8Array}: Password derived key for authenticating wallet actions ***(required)***
- `url` {String}: RPC url for Ethereum node ***(default: 'https://mainnet.infura.io/')***
### *Usage*
```javascript
Eth.connectToEthereum({
  // Uses keystore & pw for address generation
  wallet: { ks, pwDerivedKey },
  url: /* Ethereum node location/address */
})
.then(({ web3 }) => {
  //  Connected Web3 instance
});
```
-- -
### **Eth.getWalletInterface({ web3 })**
#### -> ***Promise:`({ send, call, transact })`***
- `web3` {Object}: Connected Web3 instance through `web3-provider-engine` ***(required)***
### *Usage*
```javascript
Eth.getWalletInterface({ web3 })
.then(({ send, call, transact }) => {
  // Promisified wallet interface utilities
  return send({ to: '0xc7fede610d0fa75dd87e7ab42781814919adea79', value: web3.toWei(100000, 'ether')});
});
```
