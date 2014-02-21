#!/usr/bin/env node

var inirc = require('inirc'),
  User = require('../lib').User,
  Kata = require('../lib').Kata,
  rc = inirc('.codewarsrc'),
  DEFAULT_HOST = 'http://localhost:8999',
  user, kata;

function main(cb) {
  var config, user, kata;

  function auth(err, cfg) {
    if (err) return cb(err);
    config = cfg;
    user = new User({host: config.host || DEFAULT_HOST});
    if (!config.accessToken) {
      var name = 'todo', pass = 'todo';
      user.signIn(name, pass, addToken);
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
      host: config.host || DEFAULT_HOST,
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
