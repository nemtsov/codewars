// Most of the code was written by Jake Hoffner at Codewars
// The diff is in the substituted private & random* methods

module.exports = function createTest(done) {
  var Test = {},
    methodCalls = {},
    buffer = [],
    beforeCallbacks = [],
    afterCallbacks = [],
    describing = false, failed = [];

  function _message(message) {
    return message.replace(/\s+/g, ' ');
  }

  function _print(message) {
    message = message.trim().replace(/\s\s/g, '\n  ');
    console.log(message);
  }

  function logCall(name) {
    if (methodCalls[name]) {
      methodCalls[name]++;
    } else {
      methodCalls[name] = 1;
    }
  }

  Test.expect = function (passed, msg, options) {
    //TODO: discover available options
    msg = msg || 'Value is not what was expected';
    if (passed) {
      _print(buffer.join(''));
      done(null, 'Test Passed');
    } else {
      _print(buffer.join(''));
      done(new Error('Test Failed: ' + msg));
    }
  };

  Test.callCount = function (name) {
    return methodCalls[name] || 0;
  };

  Test.format = function (obj, options) {
    options = options || {};
    var out;
    if (typeof obj == 'string') {
      out = obj;
    } else {
      out = obj && obj !== true ?
        JSON.stringify(obj, null, options.indent ? 4 : 0) :
        ('' + obj);
    } if (out) {
      if (options.whitespace || options.indent) {
        out = out.replace(new RegExp(' ', 'g'), ' ');
      }
      if (options.lineBreaks || options.indent) {
        out = out.replace(new RegExp('\n', 'g'), ' ');
      }
      return out;
    }
    return out;
  };

  Test.inspect = function (obj) {
    logCall('inspect');
    if (typeof obj == 'string') {
      return obj;
    } else {
      return obj && obj !== true ? JSON.stringify(obj) : ('' + obj);
    }
  };

  Test.describe = function (msg, fn) {
    try {
      if (describing) throw "cannot call describe within another describe";
      logCall('describe');
      describing = true;
      buffer = [];
      buffer.push(' ');
      buffer.push(_message(msg));
      buffer.push(': ');
      fn();
    } finally {
      buffer.push(' ');
      // restore log
      _print(buffer.join(''));
      buffer = null;
      describing = false;
      beforeCallbacks = [];
      afterCallbacks = [];
      if (failed.length > 0) {
        throw failed[0];
      }
    }
  };

  Test.it = function (msg, fn) {
    if (!describing) throw '"it" calls must be invoked within a parent "describe" context';
    try {
      logCall('it');
      buffer.push(' ');
      buffer.push(_message(msg));
      buffer.push(': ');
      beforeCallbacks.forEach(function (cb) {
        cb();
      });
      try {
        fn();
      } finally {
        afterCallbacks.forEach(function (cb) {
          cb();
        });
      }
    } finally {
      buffer.push(' ');
    }
  };

  Test.before = function (cb) {
    beforeCallbacks.push(cb);
  };

  Test.after = function (cb) {
    afterCallbacks.push(cb);
  };

  Test.assertSimilar = function (actual, expected, msg, options) {
    logCall('assertSimilar');
    this.assertEquals(this.inspect(actual),
      this.inspect(expected), msg, options);
  };

  Test.assertNotSimilar = function (actual, expected, msg, options) {
    logCall('assertNotSimilar');
    this.assertNotEquals(this.inspect(actual),
      this.inspect(expected), msg, options);
  };

  Test.assertEquals = function (actual, expected, msg, options) {
    logCall('assertEquals');
    if (actual !== expected) {
      msg = _message('Expected: ' + Test.inspect(expected) +
        ', instead got: ' + Test.inspect(actual), msg);
      Test.expect(false, msg, options);
    } else {
      options = options || {};
      options.successMsg = options.successMsg ||
        'Value == ' + Test.inspect(expected);
      Test.expect(true, null, options);
    }
  };

  Test.assertNotEquals = function (a, b, msg, options) {
    logCall('assertNotEquals');
    if (a === b) {
      msg = _message('Not Expected: ' + Test.inspect(a), msg);
      Test.expect(false, msg, options);
    } else {
      options = options || {};
      options.successMsg = options.successMsg || 'Value != ' + Test.inspect(b);
      Test.expect(true, null, options);
    }
  };

  Test.expectNoError = function (msg, fn) {
    logCall('expectNoError');
    if (!fn) {
      fn = msg;
      msg = 'Unexpected error was thrown';
    }
    try {
      fn();
      Test.expect(true);
    } catch (ex) {
      if (ex.name == 'Test:Error') {
        throw ex;
      } else {
        msg += ': ' + ex.toString();
        Test.expect(false, msg);
      }
    }
  };

  Test.expectError = function (msg, fn, options) {
    logCall('expectError');
    if (!fn) {
      fn = msg;
      msg = 'Expected an error to be thrown';
    }
    var passed = false;
    try {
      fn();
    } catch (ex) {
      console.log('Expected error was thrown: ' + ex.toString());
      passed = true;
    }
    Test.expect(passed, msg, options);
  };

  Test.randomNumber = function () {
    return Math.floor(Math.random() * 100);
  };

  Test.randomToken = function () {
    var alpha = 'abcdefghijklmnopqrstuvwxyz0123456789';
    alpha = alpha.split('');
    this.randomize(alpha);
    return alpha.join('').substring(0, 10);
  };

  // the knuth-shuffle
  Test.randomize = function (array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  Test.sample = function (array) {
    logCall('sample');
    return array[~~(array.length * Math.random())];
  };

  Test.Error = function (message) {
    logCall('Error');
    this.name = "Test:Error";
    this.message = (message || "");
  };

  return Test;
};
