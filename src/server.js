// external
const http = require('http');

// internal
const net = require('./utils/network');
const app = require('./express');


//**********************************************************/
// set express endpoints
require("./endpoints/express/authentication");

//**********************************************************/
// start server (need to start server before socket io)
const server = http.createServer(app);
server.listen(net.port, () => {
    console.log("listening... " + net.host + ":" + net.port);
});

//**********************************************************/
// set socket io config
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

require('./middleware/socket_middleware')(io);

io.on("connection", (socket) => {
    require("./endpoints/sockets/chat").set(io, socket);
});