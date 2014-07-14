var fs = require('fs'),
  path = require('path'),
  read = require('read'),
  colors = require('colors'),
  cwd = process.cwd();

module.exports = KataView;

/**
 * Responsible for reading and writing
 * the kata from and to the disk and
 * interracting with the user.
 */

function KataView() {
  this._files = {
    readme: path.join(cwd, 'README.md'),
    kata: path.join(cwd, 'kata.js'),
    test: path.join(cwd, 'test.js'),
    kataInfo: path.join(cwd, '.kata.json')
  };
}

KataView.prototype.write = function (kata, cb) {
  var self = this;

  if (fs.existsSync(this._files.readme) ||
      fs.existsSync(this._files.kata) ||
      fs.existsSync(this._files.test) ||
      fs.existsSync(this._files.kataInfo)) {
    console.log('The current directory isn\'t empty.'.red);
    return read({
      prompt: 'Would you like to override the existing ' +
        'files (y/n)? ',
      default: 'no'
    }, maybeWrite);
  }

  function maybeWrite(err, answer) {
    if (err) return cb(err);

    // session is empty when getting kata by id/slug
    kata.session = kata.session || {
      setup: '',
      exampleFixture: ''
    };

    if (/(y|yes)/.test(answer)) {
      fs.writeFileSync(self._files.readme, kata.description);
      fs.writeFileSync(self._files.kata, kata.session.setup);
      fs.writeFileSync(self._files.test, kata.session.exampleFixture);
      fs.writeFileSync(self._files.kataInfo,
        JSON.stringify(kata, null, '  '));
      cb(null, 'The kata is ready for you. Good luck!'.green);
      return;
    }

    cb(null, 'Ok, I won\'t update your files.'.yellow);
  }

  maybeWrite(null, 'yes');
};

KataView.prototype.read = function (cb) {
  var info;

  if (!fs.existsSync(this._files.kataInfo)) return cb(
    new Error(this._files.kataInfo + ' is not found'));

  if (!fs.existsSync(this._files.kata)) return cb(
    new Error(this._files.kata + ' is not found'));

  info = require(this._files.kataInfo);
  info.solution = fs.readFileSync(this._files.kata,
    {encoding: 'utf-8'});

  process.nextTick(function () {
    cb(null, info);
  });
};

KataView.prototype.renderAttempt = function (results, cb) {
  if (!results.valid) {
    console.log('Try again.');
    console.log('\nOutput:\n'.yellow + results.output.join('').replace(/\\n/, ''));
    console.log('\nReason:'.yellow + results.reason.red);
  } else {
    console.log('Success!'.green);
    //TODO: console.log('Your new honor is: ' + me.honor. Congrats!')
  }
  cb(null);
};
