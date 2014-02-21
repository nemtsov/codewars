#!/usr/bin/env node

var inirc = require('inirc'),
  User = require('../lib').User,
  Kata = require('../lib').Kata,
  rc = inirc('.codewarsrc'),
  read = require('read'),
  DEFAULT_HOST = 'http://localhost:8999',
  user, kata;

function main(cb) {
  var config, host, user, kata;

  function auth(err, cfg) {
    if (err) return cb(err);
    config = cfg;
    host = config.host || DEFAULT_HOST;
    user = new User({host: host});
    if (!config.accessToken) {
      readCreds(host, function (err, creds) {
        if (err) return cb(err);
        user.signIn(creds.username, creds.password, addToken);
      });
    } else {
      getKata(null);
    }
  }

  function addToken(err, user) {
    if (err) return cb(err);
    config.accessToken = user.private_key;
    rc.put(config, getKata);
  }

  function getKata(err) {
    if (err) return cb(err);
    kata = new Kata({
      host: host,
      accessToken: config.accessToken
    });
    kata.next(done);
  }

  function done(err, exercise) {
    if (err) return cb(err);
    cb(null, exercise);
  }

  rc.get(auth);
}

function readCreds(host, cb) {
  read({prompt: host + ' username: '}, function (err, username) {
    if (err) return cb(err);
    read({
      prompt: host + ' password for ' + username + ' (never stored): ',
      silent: true
    }, function (err, password) {
      cb(err, {
        username: username,
        password: password
      });
    });
  });
}

main(function (err) {
  if (err) throw err;
  console.log('ok');
});


//kata = new Kata(config);

//kata.get('123', function (err, kata) {
  //if (err) throw err;
  //console.log(kata);
//});

//kata.next(function (err, kata) {
  //if (err) throw err;
  //console.log(kata);
//});

//kata.attempt('123', '456', 'isok=true', function (err, results) {
  //if (err) throw err;
  //console.log(results);
//});
