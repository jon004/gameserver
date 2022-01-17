const session_manager = require('./express').session_manager;

const setMiddleware = (io) => {
    io.use((socket, next) => {
        // TODO : check if token is valid
        session_manager(socket.request, {}, next);
    });

    io.use((socket, next) => {
        if (socket.request.session == null || socket.request.session.passport == null) {
            console.log(socket.id + " not authenticated, socket disconnecting...");
            socket.disconnect();
            return;
        } else {
            console.log("socket connecting... " + socket.request.session.passport.user);
            return next();
        }
    });
};

module.exports = setMiddleware;