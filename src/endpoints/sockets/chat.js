const db = require('../../databases/usernamedb');

const set = (server, client) => {
    let user = client.request.session.passport.user;
    server.emit("online", db.getUsernames());
    client.broadcast.emit("chat", "server", user + " joined the chat");

    client.on("chat", (message) => {
        message = message.trim();
        if (message.length == 0)
            return;
        server.emit("chat", user, message);
    });

    client.on("disconnect", () => {
        db.delUserByUsername(user);
        server.emit("online", db.getUsernames());
        client.broadcast.emit("chat", "server", user + " left the chat");
    });
}

module.exports = { set };