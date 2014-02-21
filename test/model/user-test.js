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
    user._post.yields(null, {private_key: '33'});
    user.signIn('name', 'pass', function (err, user) {
      if (err) return done(err);
      user.private_key.should.equal('33');
      done();
    });
  });
});
