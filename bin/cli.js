#!/usr/bin/env node

require('colors');

var inirc = require('inirc'),
  Auth = require('../lib/auth'),
  TestRunner = require('../lib/test/runner'),
  User = require('../lib').User,
  Kata = require('../lib').Kata,
  KataView = require('../lib/kata/view'),
  rc = inirc('.codewarsrc'),
  DEFAULT_HOST = 'http://localhost:8999';

module.exports = cli;

/**
 * The controller.
 *
 * It is responsible for initializing the classes
 * of this library, taking user's input and calling
 * the appropriate methods on the initialized classes.
 */

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
    var kata, runner, cli, isWatchOn, kataView;
    if (err) return cb(err);

    kata = new Kata(config);
    runner = new TestRunner();
    kataView = new KataView();

    function writeKata(err, kata) {
      if (err) return cb(err);
      kataView.write(kata, cb);
    }

    function attempt(err, info) {
      if (err) return cb(err);
      kata.attempt(info.id, info.solution_id,
        info.solution, attemptResults);
    }

    function attemptResults(err, results) {
      if (err) return cb(err);
      kataView.renderAttempt(results, cb);
    }

    switch (command) {
      case 'next': {
        kata.next(writeKata);
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
        kataView.read(attempt);
        break;
      }
      default: {
        if (!command || !/[a-zA-Z0-9]+/.test(command)) return usage(cb);
        kata.get(command, writeKata);
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
    if (err) console.error('Error: '.red + err.message.red);
    if (message) console.log(message);
  });
}
