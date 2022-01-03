const http = require("http");
const socketIO = require("socket.io");
const express_components = require("./config/express_config");

//**********************************************************/

const app = express_components.app;

require("./endpoints/authentication")
    .set(app, express_components.auth.passport);

//**********************************************************/

const port = 3000;
const host = "localhost";

const server = http.createServer(app);
server.listen(port, () => {
    console.log("listening... host:" + host + ", port:" + port);
});

// const io = socketIO(server, { cors: {origin: "*"} });
// io.on("connection", (socket) => {
//     socket.on("disconnect", () => {});
// });