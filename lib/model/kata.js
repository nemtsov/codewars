var Client = require('./_client'),
  inherits = require('util').inherits;

module.exports = Kata;

function Kata(config) {
  Client.call(this, config);
}

inherits(Kata, Client);

Kata.prototype.next = function (cb) {
  this.get('next', cb);
};

Kata.prototype.get = function (kataId, cb) {
  this._get('/kata/' + kataId, cb);
};

Kata.prototype.attempt = function (kataId, solutionId, solution, cb) {
  this._post('/kata/' + kataId + '/solution/' + solutionId + '/attempt', {
    json: {solution: solution}
  }, cb);
};
