var childProcess = require('child_process'),
  fs = require('fs'),
  cwd = process.cwd();

module.exports = Runner;

function Runner() {
}

Runner.prototype.run = function(isWatchOn, cb) {
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
    childProcess.fork(__dirname + '/runnable.js');
  }

  if (isWatchOn) watch();
  run();
};
