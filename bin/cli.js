#!/usr/bin/env node

var inirc = require('inirc'),
  User = require('../lib').User,
  Kata = require('../lib').Kata,
  rc = inirc('.codewarsrc'),
  read = require('read'),
  DEFAULT_HOST = 'http://localhost:8999',
  user, kata;

if (process.argv[2] === 'test') {
  var isWatchOn = process.argv.some(function (arg) {
    return /(--watch|-w)/.test(arg);
  });
  runTest(isWatchOn);
}

function runTest(isWatchOn) {
  var childProcess = require('child_process');
  var fs = require('fs');
  var cwd = process.cwd();

  function watch() {
    clearScreen();
    function changed(event, filename) {
      if (/(kata.js|test.js)/.test(filename)) return;
      clearScreen();
      run();
    }
    fs.watch(cwd, changed);
  }

  function clearScreen() {
    // clear screen & set cursor position
    process.stdout.write('\u001b[2J');
    process.stdout.write('\u001b[2;1H');
  }

  function run() {
    childProcess.fork(__dirname + '/../lib/test_runner.js');
  }

  if (isWatchOn) watch();
  run();
}

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

//main(function (err) {
  //if (err) throw err;
  //console.log('ok');
//});


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
