var read = require('read');

module.exports = Auth;

/**
 * Responsible for reading user's access token (via readline).
 */

function Auth(config) {
  this._config = config;
}

Auth.prototype.readToken = function (cb) {
  read({
    prompt: 'Please enter your Access Token (it can be found on the profile page):'
  }, cb);
};
