var proxyquire = require('proxyquire'),
  sinon = require('sinon');

describe('Client', function () {
  var client, request;

  beforeEach(function () {
    var Client;
    request = sinon.stub();
    Client = proxyquire('../../lib/model/_client', {
      'request': request
    });
    client = new Client({host: 'h', accessToken: 't'});
  });

  describe('_req', function () {
    it('should call if 200', function (done) {
      request.yields(null, {statusCode: 200}, {a: 1});
      client._req('GET', '/a', {}, function (err, body) {
        if (err) return done(err);
        body.should.eql({a: 1});
        done();
      });
    });

    it('should err if not 200', function (done) {
      request.yields(null, {statusCode: 400}, {});
      client._req('GET', '/a', {}, function (err, body) {
        err.message.should.match(/bad status/);
        done();
      });
    });
  });
});
