var Client = require('./_client'),
  assert = require('assert'),
  util = require('util'),
  inherits = util.inherits,
  format = util.format;

module.exports = Kata;

/**
 * Responsible for getting and sending data
 * to codewars' kata service.
 */

function Kata(config) {
  assert(config.accessToken, 'config.accessToken must be set');
  Client.call(this, config);
}

inherits(Kata, Client);

Kata.prototype.next = function (cb) {
  this._post('/code-challenges/javascript/train', cb);
};

Kata.prototype.get = function (kataId, cb) {
  this._get(format('/code-challenges/%s', kataId), cb);
};

Kata.prototype.attempt = function (projectId, solutionId, solution, cb) {
  var self = this,
    pathTpl = '/code-challenges/projects/%s/solutions/%s/attempt',
    pollCounter = 0;

  function poll(err, result) {
    var dmid;
    if (err) return cb(err);
    if (pollCounter++ > 20) {
      return cb(new Error('too many deferred response attempts'));
    }
    dmid = result.dmid;
    self._get(format('/deferred/%s', dmid), check.bind(null, dmid));
  }

  function check(dmid, err, result) {
    if (err) return cb(err);
    if (result.success) return cb(null, result);
    setTimeout(poll.bind(null, null, {dmid: dmid}), 500);
  }

  this._post(format(pathTpl, projectId, solutionId), {
    json: {
      code: solution,
      output_format: 'raw'
    }
  }, poll);
};
