// external
const http = require('http');
const socketIO = require('socket.io');

// internal
const app = require('./express');
const net = require('./utils/network');

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
// set socket io endpoints
const io = socketIO(server, {cors: {origin: '*'}});
io.on("connect", (socket) => {
    require("./endpoints/sockets/connection").set(socket);
})
