var Hapi = require('hapi');
var http = require('https');
var request = require('request');
// var url = require('url');
var querystring = require('querystring');
require('env2')('config.env');

var server = new Hapi.Server();

var port = process.env.PORT || 3000;

function getRequestToken(options, cb) {
    // var request = http.request(options, function(response) {
    //     var body = '';
    //     response.on('data', function(chunk) {
    //         body += chunk;
    //     });
    //     response.on('end', function() {
    //         cb(null, body);
    //     });
    // });
    //
    // request.on('error', function(err) {
    //     console.error('request to ' + options.host + ' failed');
    //     cb(err);
    // });
    //
    // request.write(options.body);
    // request.end();
}

function createTwitterAuthRoute(token){
    console.log(token);
    return "https://api.twitter.com/oauth/authenticate?" + querystring.stringify({
        oauth_token: token,
        redirect_uri: process.env.BASE_URL + "/home"
    });
}

var requestTokenUrl = "https://api.twitter.com/oauth/request_token";
var consumerKey = process.env.TWITTER_CLIENT_ID;
var consumerSecret = process.env.TWITTER_CLIENT_SECRET;
var oauth = {
    // callback: 'http://localhost:3000/signin-with-twitter',
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
};
var oauthToken = '';
var oauthTokenSecret = '';

server.connection({
    port: port
});

server.route([
    {
        path: '/',
        method: 'GET',
        handler: function(req, reply){
            request.post({url: requestTokenUrl, oauth: oauth}, function(err, r, body) {
                var reqData = querystring.parse(body);
                oauthToken = reqData.oauth_token;
                oauthTokenSecret = reqData.oauth_token_secret;
                var uri = 'https://api.twitter.com/oauth/authenticate?' + querystring.stringify({oauth_token: oauthToken});
                var requestToken = uri.split('=')[1];
                reply.redirect(createTwitterAuthRoute(requestToken));
                // reply(uri);
            });
        }
    }, {
        path: '/signin-with-twitter',
        method: 'GET',
        handler: function(req, reply) {
            var authReqData = req.query;
            oauth.token = authReqData.oauth_token;
            oauth.token_secret = oauthTokenSecret;
            oauth.verifier = authReqData.oauth_verifier;

            var accessTokenUrl = "https://api.twitter.com/oauth/access_token";

            request.post({url: accessTokenUrl, oauth: oauth}, function(e, r, body) {
                var authenticatedData = querystring.parse(body);
                console.log(authenticatedData, '-------------', body);
            });
        }
    },
    {
        path: '/home',
        method: 'GET',
        handler: function(req, reply){
            // var home = __dirname + "/../"
            reply("hey Mireia");
        }
    }
]);

module.exports = server;
