var Client = require('./_client'),
  inherits = require('util').inherits;

module.exports = User;

function User(config) {
  Client.call(this, config);
}

inherits(User, Client);

User.prototype.signIn = function (username, password, cb) {
  cb(new Error('not implemented'));
};
