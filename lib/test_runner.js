var vm = require('vm'),
  fs = require('fs'),
  colors = require('colors'),
  createTest = require('./test_framework'),
  cwd = process.cwd();

/**
 * This runner is spawned as a separate process.
 * It runs the kata in a vm.
 */

function runTest(isWatchOn) {
  var kataFilename = cwd + '/kata.js',
    testFilename = cwd + '/test.js',
    enc = {encoding: 'utf-8'},
    Test = createTest(done),
    files = [];

  function read(err, file) {
    if (err) throw err;
    files.push(file);
    if (2 === files.length) run(files[0], files[1]);
  }

  function run(kata, test) {
    var sandbox, script, err;

    sandbox = {
      describe: Test.describe,
      it: Test.it,
      Test: Test,
      console: console
    };

    script = kata + '\n' + test;

    try {
      vm.runInNewContext(script, sandbox, 'kata.js');
    } catch (e) {
      err = e;
    }

    done(err);
  }

  function done(err) {
    if (err) console.error(('\n' + err.name + ': ' + err.message).red);
    else console.log('\nTest Passed'.green);
    process.exit(0);
  }

  fs.readFile(kataFilename, enc, read);
  fs.readFile(testFilename, enc, read);
}

runTest();
