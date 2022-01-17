const { Session } = require("express-session");

const usernames = new Set();
const sessions = {};

const addUser = (username, sid) => {
    if (usernames.has(username)) {
        return false;    
    }
    usernames.add(username);
    sessions[sid] = {
        'user': username,
        'sid': sid,
        'expires': 253393117141,
    };
    return true;
};

const delUser = (sid) => {
    let user = sessions[sid].user;
    if (user == null)
        return;
    usernames.delete(user.username);
    sessions[sid] = null;
};

const getUsernames = () => {
    let cpy = [];
    usernames.forEach(e => { cpy.push(e) });
    return cpy;
};

const delUserByUsername = (username) => {
    let user = getByUsername(username);
    if (user != null) {
        sessions[user.sid] = null;
        usernames.delete(user);
    }
};


/////////////////////
// not exported below
const filter = (elements, f) => {
    let r = [];
    elements.forEach((e) => {
        if (f(e)) r.add(e);
    })
    return r;
};

const getByUsername = (username) => {
    let user = filter(usernames, (e) => {
        return e.user === username;
    });
    if (user.length === 0)
        return null;
    return user;
};

const isExpired = (sid) => {
    let user = sessions[sid];
    if (user == null) {
        return true;
    }else if (user.expires > Math.floor(new Date().getTime() / 1000)) {
        delUser(sid);
        return true;
    }
    return false;
}

module.exports = {
    addUser,
    delUser,
    getUsernames,
    delUserByUsername,
};