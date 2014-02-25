#!/usr/bin/env node

var inirc = require('inirc'),
  Auth = require('../lib/auth'),
  TestRunner = require('../lib/test/runner'),
  User = require('../lib').User,
  Kata = require('../lib').Kata,
  rc = inirc('.codewarsrc'),
  DEFAULT_HOST = 'http://localhost:8999';

module.exports = cli;

function cli(argv, cb) {
  var rcConfig, config, user,
    command = argv[2];

  function create(err, rcCfg) {
    var auth;
    if (err) return cb(err);

    rcConfig = rcCfg;

    // may contain items not suitable
    // to be saved in the rc file
    config = {
      host: DEFAULT_HOST,
      accessToken: rcConfig.accessToken
    };

    user = new User(config);
    auth = new Auth(user, config);

    if (config.accessToken) return runCommand(null);
    auth.signIn(saveAccessToken);
  }

  function saveAccessToken(err, user) {
    config.accessToken = rcConfig.accessToken = user.private_key;
    rc.put(rcConfig, runCommand);
  }

  function runCommand(err) {
    var kata, runner, cli, isWatchOn;
    if (err) return cb(err);

    kata = new Kata(config);
    runner = new TestRunner();

    function gotKata(err, exercise) {
      if (err) return cb(err);
      //TODO: do something with kata
      cb(null, exercise);
    }

    function attemptResults(err, results) {
      if (err) return cb(err);
      //TODO: do something with results
      cb(null, results);
    }

    switch (command) {
      case 'next': {
        kata.next(gotKata);
        break;
      }
      case 'test': {
        isWatchOn = argv.some(function (arg) {
          return /(--watch|-w)/.test(arg);
        });
        runner.run(isWatchOn, cb);
        break;
      }
      case 'attempt': {
        kata.attempt(attemptResults);
        break;
      }
      default: {
        if (!command || !/[a-zA-Z0-9]+/.test(command)) return usage(cb);
        kata.get(command, gotKata);
      }
    }
  }

  // get resource config
  rc.get(create);
}

function usage(cb) {
  cb(null,
    'Usage: codewars command\n\n' +
    'Commands:\n' +
    '  <kata_id>    Retrieve a kata by id\n' +
    '  next         Get the next kata\n' +
    '  test         Run the test\n' +
    '  attempt      Submit code\n\n' +
    'Options:\n' +
    '  -w, --watch  Re-run the test when a change ' +
    'to a file is detected. (Used with the `test` command)');
}

// if top level run; otherwise let the parent decide
if (!module.parent) {
  cli(process.argv, function (err, message) {
    if (err) throw err;
    if (message) console.log(message);
  });
}
