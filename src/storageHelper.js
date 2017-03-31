import Promise, { promisifyAll } from 'bluebird';

let fs = require('fs');

fs = promisifyAll(fs);


const flattenName = ({ name }) => {
  const split = name.split('.');
  return {
    n: split.slice(0, split.length - 1).join('.'),
    t: split[split.length - 1],
  };
};

export const exists = ({ path, name = 'wallet.json', options }) => {
  const { n, t } = flattenName({ name });
  let key = `${path}/${n}.${t}`;
  if (options.mobile) {
    // eslint-disable-next-line
    const { AsyncStorage } = require('react-native');
    key = `${path}:${n}:${t}`;

    // Assumes if no item is found, it'll return an error
    return AsyncStorage.getItem(key);
  }
  return fs.existsAsync(key);
};

/**
 * Function for saving wallets and other miscellaneous data
 * @type {Object}
 * @param {String} path:        Storage path
 * @param {Object} data:        Data to be stored
 * @param {String} file:        Name of file with file type included
 */
export const save = ({ path, data, name = 'wallet.json', options }) => {
  const { n, t } = flattenName({ name });
  let key = `${path}/${n}.${t}`;
  if (options.mobile) {
    // eslint-disable-next-line
    const { AsyncStorage } = require('react-native');
    key = `${path}:${n}:${t}`;
    exists({ path, name, options })
    .then(() => {
      return (options.override)
        ? AsyncStorage.setItem(key)
        : Promise.reject(`Override item: ${key}?`);
    });
  }

  return fs.writeFileAsync(key, JSON.stringify(data));
};

/**
 * Function for loading data from a file
 * @type {Object}
 * @param {String} file:        Name of file with file type included
 */
export const load = ({ path, name, options }) => {
  const { n, t } = flattenName({ name });
  let key = `${path}/${n}.${t}`;
  if (options.mobile) {
    // eslint-disable-next-line
    const { AsyncStorage } = require('react-native');
    key = `${path}:${n}:${t}`;
    return AsyncStorage.getItem(key);
  }

  return fs.readFileAsync(key);
};
