var Client = require('./_client'),
  inherits = require('util').inherits;

module.exports = User;

function User(config) {
  Client.call(this, config);
}

inherits(User, Client);

User.prototype.signIn = function (username, password, cb) {
  this._post('/users/sign_in', {
    json: {
      username: username,
      password: password
    }
  }, cb); 
};
