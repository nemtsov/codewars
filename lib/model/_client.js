var request = require('request'),
  assert = require('assert');

module.exports = Client;

/**
 * Responsible for the HTTP request formatting
 * and error handling. Used by all models.
 */

function Client(config) {
  assert(config.host, 'config.host must be set');
  this._config = config;
}

Client.prototype._get = function(path, config, cb) {
  this._req('GET', path, config, cb);
};

Client.prototype._post = function(path, config, cb) {
  this._req('POST', path, config, cb);
};

Client.prototype._req = function(method, path, config, cb) {
  if (!cb) {
    cb = config;
    config = {};
  }

  function done(err, res, body) {
    if (err) return cb(err);
    if (200 !== res.statusCode) {
      return cb(new Error('bad status code: ' + res.statusCode));
    }
    cb(null, body);
  }

  config = defaults(config, {
    method: method,
    url: this._config.host + path,
    qs: {
      private_key: this._config.accessToken
    },
    json: true
  });

  request(config, done);
};

function defaults(obj, def) {
  obj = obj || {};
  Object.keys(def).forEach(function (key) {
    if ('object' === typeof def[key]) {
      obj[key] = defaults(obj[key], def[key]);
    } else {
      if (!obj[key]) obj[key] = def[key];
    }
  });
  return obj;
}
