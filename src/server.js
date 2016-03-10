var Hapi = require('hapi');
var http = require('https');
var request = require('request');
// var url = require('url');
var querystring = require('querystring');
require('env2')('config.env');
var handlebars = require('handlebars');
var vision = require('vision');
var inert = require('inert');
var plugins = [inert, vision];

var server = new Hapi.Server();

var port = process.env.PORT || 3000;

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
    callback: process.env.BASE_URL + "/signin-with-twitter",
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
};
var oauthToken = '';
var oauthTokenSecret = '';

server.connection({
    port: port
});

server.register(plugins, function(err) {
    server.views({
        engines: { html: handlebars},
        relativeTo: __dirname + '/../',
        path: 'views',
        layout: 'default',
        layoutPath: 'views/layout'
    });

    server.route([
        {
            path: '/',
            method: 'GET',
            handler: function(req, reply){
                request.post({url: requestTokenUrl, oauth: oauth}, function(err, r, body) {
                    var reqData = querystring.parse(body);
                    console.log(reqData, 'reqdata!!!!');
                    oauthToken = reqData.oauth_token;
                    oauthTokenSecret = reqData.oauth_token_secret;
                    console.log(oauthToken, oauthTokenSecret, 'other stufffff');
                    var uri = 'https://api.twitter.com/oauth/authenticate?' + querystring.stringify({oauth_token: oauthToken});
                    reply.view('login', {uri:uri});
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
                    // not 100% sure what we need here right now, so I redirected to home for now
                    // we should figure out json web tokens first!
                    reply.redirect('home');
                });
            }
        },
        {
            path: '/home',
            method: 'GET',
            handler: function(req, reply){
                reply.view('home');
            }
        },
        {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public',
                redirectToSlash: true,
                index: true
            }
          }
       }
    ]);

});


module.exports = server;
