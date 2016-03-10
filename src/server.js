var Hapi = require('hapi');
var http = require('https');
var Twitter = require('twitter');
var request = require('request');
// var url = require('url');
var querystring = require('querystring');
require('env2')('config.env');
var handlebars = require('handlebars');
var vision = require('vision');
var inert = require('inert');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET;
var plugins = [inert, vision];
var Twitter = require('twitter');

var server = new Hapi.Server();

var port = process.env.PORT || 3000;

var client = new Twitter({

    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var requestTokenUrl = "https://api.twitter.com/oauth/request_token";
var consumerKey = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

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
                if (!(req.state.request_token && req.state.access_token)) {
                    // console.log(req.state.access_token, "access_token number 1");
                    request.post({url: requestTokenUrl, oauth: oauth}, function(err, r, body) {
                        var reqData = querystring.parse(body);
                        oauthToken = reqData.oauth_token;
                        oauthTokenSecret = reqData.oauth_token_secret;
                        var uri = 'https://api.twitter.com/oauth/authenticate?' + 'oauth_token='+oauthToken;
                        //querystring.stringify({oauth_token: oauthToken});
                        reply.view('login', {uri:uri}).state('request_token', oauthToken);
                    });
                }
                else{
                    console.log("boomtastic");
                    reply.redirect('home');
                }
            }
        },
        {
            path: '/signin-with-twitter',
            method: 'GET',
            handler: function(req, reply) {
                console.log(req.state.request_token, "request_token number 2");
                var authReqData = req.query;
                oauth.token = authReqData.oauth_token;
                oauth.token_secret = oauthTokenSecret;
                oauth.verifier = authReqData.oauth_verifier;
                // console.log(oauth);
                var accessTokenUrl = "https://api.twitter.com/oauth/access_token";
                request.post({url: accessTokenUrl, oauth: oauth}, function(e, r, body) {
                    var authenticatedData = querystring.parse(body);
                    console.log(authenticatedData);
                    // console.log(authenticatedData.oauth_token, authenticatedData.oauth_token_secret, '$$$$$$$$$$');

                    // not 100% sure what we need here right now, so I redirected to home for now
                    // we should figure out json web tokens first!
                    var accessToken = authenticatedData.oauth_token;
                    reply.redirect('home').state('access_token', accessToken);
                });
            }
        },
        {
            path: '/home',
            method: 'GET',
            handler: function(req, reply){
                client.stream('statuses/filter', {track: 'PackageSam'}, function(stream) {
                    stream.on('data', function(tweet) {
                        client.post('statuses/update', {status: 'Can I see your package?'}, function(error, tweet, response) {
                        if (error) throw error;
                        console.log(tweet); // Tweet body.
                        console.log(response); // Raw response object.
                    });
                    });

                    stream.on('error', function(error) {
                        throw error;
                    });
                });
                reply.view('home');
            }
        },
        // {
        //     path: '/send-tweet',
        //     method: 'GET',
        //     handler: function(req, reply) {
        //         client.post('statuses/update', {status: 'I Love Twitter'}, function(error, tweet, response) {
        //             if (error) throw error;
        //             console.log(tweet); // Tweet body.
        //             console.log(response); // Raw response object.
        //             reply('hi');
        //         });
        //     }
        // },
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
