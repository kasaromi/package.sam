var Hapi = require('hapi');
require('env2')('config.env');
var handlebars = require('handlebars');
var vision = require('vision');
var inert = require('inert');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET;
var plugins = [inert, vision];

// routes
var loadPageRoute = require('./routes/requestTokensAndSignin.js').loadPagePath;
var signinWithTwitterRoute = require('./routes/requestTokensAndSignin.js').signinWithTwitterPath;
var homePageRoute = require('./routes/home.js');
var accessResourcesRoute = require('./routes/resources.js');

var server = new Hapi.Server();

var port = process.env.PORT || 3000;

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
        loadPageRoute,
        signinWithTwitterRoute,
        homePageRoute,
        accessResourcesRoute
    ]);
});


module.exports = server;
