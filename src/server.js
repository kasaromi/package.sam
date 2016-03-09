var Hapi = require('hapi');
var http = require('https');
// var url = require('url');
var querystring = require('querystring');
require('env2')('config.env');

var server = new Hapi.Server();

var port = process.env.PORT || 3000;

function getRequestToken() {
    return "https://api.twitter.com/oauth/request_token";
}

function createTwitterAuthRoute(){
    console.log(process.env.TWITTER_CLIENT_ID);
    return "https://api.twitter.com/oauth/authorize?" + querystring.stringify({
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: process.env.BASE_URL + "/home"
    });
}

server.connection({
    port: port
});

server.route([
    {
        path: '/',
        method: 'GET',
        handler: function(req, reply){
            reply.redirect(createTwitterAuthRoute());
        }
    }, {
        path: '/home',
        method: 'GET',
        handler: function(req, reply){
            // var home = __dirname + "/../"
            reply("hey Mireia");
        }
    }
]);

module.exports = server;
