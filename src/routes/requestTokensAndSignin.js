var request = require('request');
var querystring = require('querystring');
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

var loadPagePath = {
    path: '/',
    method: 'GET',
    handler: function(req, reply){
        if (!(req.state.request_token && req.state.access_token)) {
            request.post({url: requestTokenUrl, oauth: oauth}, function(err, r, body) {
                var reqData = querystring.parse(body);
                oauthToken = reqData.oauth_token;
                oauthTokenSecret = reqData.oauth_token_secret;
                var uri = 'https://api.twitter.com/oauth/authenticate?' + 'oauth_token='+oauthToken;
                reply.view('login', {uri:uri}).state('request_token', oauthToken);
            });
        }
        else{
            reply.redirect('home');
        }
    }
};

var signinWithTwitterPath = {
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
            var accessToken = authenticatedData.oauth_token;

            reply.redirect('home').state('access_token', accessToken);
        });
    }
};

module.exports = {
    loadPagePath : loadPagePath,
    signinWithTwitterPath: signinWithTwitterPath
};
