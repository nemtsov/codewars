#!/usr/bin/env node

var Kata = require('../lib').Kata,
  config, kata;

config = {
  host: 'http://localhost:8999',
  accessToken: 'secret'
};

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
