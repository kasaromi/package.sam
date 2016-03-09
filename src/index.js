var server = require('./server.js');

server.start(function(err){
    if(err) throw err;
    console.log(server.info.uri);
    console.log('server started!');
});
