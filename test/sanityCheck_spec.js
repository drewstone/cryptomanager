import { assert } from 'chai';
import Cryptos from '../src';

const { Eth } = Cryptos;

describe('mocha', () => {
  let config = {
    password: 'password',
    path: `${process.env.PWD}/test/test-data`,
  };

  it('should assert Eth is an actual utility', () => {
    assert.property(Eth, 'connectToEthereum');
    assert.property(Eth, 'createWallet');
  });

  it('should create a new Ethereum wallet', () => {
    return Eth.createWallet(config)
    .then(({ ks, pwDerivedKey, mnemonic }) => {
      assert.ok(ks);
      assert.ok(pwDerivedKey);
      assert.ok(mnemonic);
    });
  });

  it('should connect to Ethereum', () => {
    return Eth.createWallet(config)
    .then(({ ks, pwDerivedKey, address }) => {
      return Eth.connectToEthereum({
        wallet: { ks, pwDerivedKey },
        url: 'http://localhost:8545',
      })
      .then(({ web3 }) => {
        assert.ok(web3);
      });
    });
  });

  it('should get the wallet interface', () => {
    return Eth.createWallet(config)
    .then(({ ks, pwDerivedKey, address }) => {
      return Eth.connectToEthereum({
        wallet: { ks, pwDerivedKey },
        url: 'http://localhost:8545',
      })
      .then(({ web3 }) => (Eth.getWalletInterface({ web3 })))
      .then(({ send, call, transact }) => {
        assert.ok(send);
        assert.ok(call);
        assert.ok(transact);
      })
    });
  });
});
