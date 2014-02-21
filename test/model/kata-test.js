var proxyquire = require('proxyquire'),
  sinon = require('sinon');

describe('Kata', function () {
  var kata;

  beforeEach(function () {
    var Kata;
    function Client() {
      this._get = sinon.stub();
      this._post = sinon.stub();
    }
    Kata = proxyquire('../../lib/model/kata', {'./_client': Client});
    kata = new Kata({host: 'h', accessToken: 't'});
  });

  it('should get', function (done) {
    kata._get.yields(null, {id: 2});
    kata.get('3', function (err, kata) {
      if (err) return done(err);
      kata.id.should.equal(2);
      done();
    });
  });

  it('should get next', function (done) {
    kata._get.yields(null, {id: 3});
    kata.next(function (err, kata) {
      if (err) return done(err);
      kata.id.should.equal(3);
      done();
    });
  });

  it('should attempt', function (done) {
    kata._post.yields(null, {id: 2});
    kata.attempt('1', '2', 'sol', function (err, res) {
      if (err) return done(err);
      res.id.should.equal(2);
      done();
    });
  });
});
