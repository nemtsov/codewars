var proxyquire = require('proxyquire'),
  sinon = require('sinon');

describe('User', function () {
  var user;

  beforeEach(function () {
    var User;
    function Client() {
      this._get = sinon.stub();
      this._post = sinon.stub();
    }
    User = proxyquire('../../lib/model/user', {'./_client': Client});
    user = new User({host: 'h', accessToken: 't'});
  });

  it('should get', function (done) {
    user.signIn('name', 'pass', function (err, user) {
      err.message.should.equal('not implemented');
      done();
    });
  });
});
