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