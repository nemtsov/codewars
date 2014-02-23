var http = require('http'),
  server;

/**
 * Integration testing server
 */

server = http.createServer(function (req, res) {
  var headers = {'Content-type': 'application/json'},
    statusCode = 200,
    body = 'ok';

  console.log(req.method, req.url);

  if (/^\/users\/sign_in/.test(req.url)) {
    body = {private_key: 'secret'};
  } else if (/^\/kata\/123\/solution\/456\/attempt.*private_key=secret/.test(req.url)) {
    body = {
      errors: []
    };
  } else if (/^\/kata\/[^\/]+\/?[^\/]*private_key=secret/.test(req.url)) {
    body = {
      id: '123',
      name: 'Find a needle in a haystack',
      discipline: 'Algorithms',
      description: 'In this exercise...',
      preloaded: 'function find(needle, haystack) {\n}',
      test_fixture: 'Test.expect(find(3, [1, 2, 3]), \'3 is found\');',
      solution_id: '456'
    };
  } else {
    statusCode = 400;
    body = 'bad request';
  }

  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(body));
});

server.listen(8999);
