var tape = require('tape');
var url = require('url');
var querystring = require('querystring');
var server = require('../src/server.js');

tape('/ endpoint redirect to twitter login', function(t) {
    var options = {
        url: '/',
        method:'GET'
    };

    server.inject(options, function(response) {
        console.log('()()())()()()', response);
        t.ok(response.statusCode, 302, 'server redirects');
        t.end();
    });
});
