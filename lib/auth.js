var read = require('read');

module.exports = Auth;

function Auth(user, config) {
  this._user = user;
  this._config = config;
}

Auth.prototype.signIn = function (cb) {
  var self = this;

  function userSignIn(err, creds) {
    if (err) return cb(err);
    self._user.signIn(creds.username, creds.password, cb);
  }

  self._readCreds(this._config.host, userSignIn);
};

Auth.prototype._readCreds = function (host, cb) {
  var username, password;

  function user(err, u) {
    if (err) return cb(err);
    username = u;
    read({
      prompt: host + ' password for ' + username + ' (never stored): ',
      silent: true
    }, pass);
  }

  function pass(err, p) {
    password = p;
    cb(err, {
      username: username,
      password: password
    });
  }

  read({prompt: host + ' username: '}, user);
};
