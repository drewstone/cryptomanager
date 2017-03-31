import Promise from 'bluebird';
import ProviderEngine from 'web3-provider-engine';
import DefaultFixture from 'web3-provider-engine/subproviders/default-fixture';
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
import CacheSubprovider from 'web3-provider-engine/subproviders/cache';
import FilterSubprovider from 'web3-provider-engine/subproviders/filters';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';

/**
 * Creates a Provider for signing transactions and exposes a Web3 instance
 * @method
 * @param  {Object} opts:       Options specific to Ethereum provider/connection
 * @return {Object}             Web3 and provider engine instances
 */
export default function (opts = {}) {
  const engine = new ProviderEngine();

  // static
  const staticSubprovider = new DefaultFixture(opts.static);
  engine.addProvider(staticSubprovider);

  // nonce tracker
  engine.addProvider(new NonceTrackerSubprovider());

  // sanitization
  const sanitizer = new SanitizingSubprovider();
  engine.addProvider(sanitizer);

  // cache layer
  const cacheSubprovider = new CacheSubprovider();
  engine.addProvider(cacheSubprovider);

  // filters
  const filterSubprovider = new FilterSubprovider();
  engine.addProvider(filterSubprovider);

  // id mgmt
  const idmgmtSubprovider = new HookedWalletSubprovider({
    // accounts
    getAccounts: opts.getAccounts,
    // transactions
    processTransaction: opts.processTransaction,
    approveTransaction: opts.approveTransaction,
    signTransaction: opts.signTransaction,
    publishTransaction: opts.publishTransaction,
    // messages
    // old eth_sign
    processMessage: opts.processMessage,
    approveMessage: opts.approveMessage,
    signMessage: opts.signMessage,
    // new personal_sign
    processPersonalMessage: opts.processPersonalMessage,
    approvePersonalMessage: opts.approvePersonalMessage,
    signPersonalMessage: opts.signPersonalMessage,
    personalRecoverSigner: opts.personalRecoverSigner,
  });
  engine.addProvider(idmgmtSubprovider);

  // data source
  const fetchSubprovider = new FetchSubprovider({
    rpcUrl: opts.rpcUrl || 'https://mainnet.infura.io/',
  });
  engine.addProvider(fetchSubprovider);

  // start polling
  engine.start();

  return engine;
}
