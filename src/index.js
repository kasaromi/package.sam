var server = require("./server.js");

server.start(function(err) {
    if (err) throw err;
    console.log("server is running at :", server.info.port);
});
