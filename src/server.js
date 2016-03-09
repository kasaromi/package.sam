var Hapi = require('hapi');
var http = require('https');
var url = require('url');
var server = new Hapi.Server();
var port = process.env.PORT || 3000;

function createTwitterAuthRoute(){
    return 'twitter.com';
}

server.connection({
    port: port
})

server.route([
    {
        path: '/',
        method: 'GET',
        handler: function(req, reply){
            reply.redirect(createTwitterAuthRoute())
        }
    }]);

module.exports = server;
