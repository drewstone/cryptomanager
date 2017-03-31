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
      .then((helper) => {
        assert.ok(helper);
        return helper.getBalance({ address });
      });
    })
    .then((balance) => {
      assert.ok(typeof balance === 'number');
    });
  });

  it('should get coinbase of Web3 instance', () => {
    let addr;
    return Eth.createWallet(config)
    .then(({ ks, pwDerivedKey, address }) => {
      addr = address;
      return Eth.connectToEthereum({
        wallet: { ks, pwDerivedKey },
        url: 'http://localhost:8545',
      })
      .then((helper) => {
        return helper.getCoinbase();
      });
    })
    .then((address) => {
      assert.equal(addr, `0x${address}`);
    });    
  })
});
