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
      preloaded: 'function find(needle, haystack) {\n}',
      test_fixture: 'Test.expect(find(3, [1, 2, 3]), \'3 is found\');',
      solution_id: '456',
      resultId: "53090b16aca5bcf5b60008be",
      startedAt: "2014-02-22T20:40:24Z",
      description: "In this kata you have to create all permutations...",
      package: "",
      exampleFixture: "describe('permutations', function() {\n  it('examples from description', function() {\n    Test.assertSimilar(permutations('a'), ['a']);\n    Test.assertSimilar(permutations('ab').sort(), ['ab', 'ba'].sort());\n    Test.assertSimilar(permutations('aabb').sort(), ['aabb', 'abab', 'abba', 'baab', 'baba', 'bbaa'].sort());\n  });\n});",
      newPlay: false,
      workingSolution: null
    };
  } else {
    statusCode = 400;
    body = 'bad request';
  }

  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(body));
});

server.listen(8999);
