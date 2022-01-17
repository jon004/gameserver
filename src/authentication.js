// external
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// internal
require('dotenv').config({ path: "./local.env" });
const usernames = require("./databases/usernamedb");

//****************************************************************//
const loggedInVerification = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect("/");
}
  

const loggedOutVerification = (req, res, next) => {
    if (!req.isAuthenticated())
        return next();
    res.redirect("/");
}

//****************************************************************//

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "username",
    passReqToCallback: true,
}, (req, username, password, done) => {
    if (usernames.addUser(username, req.sessionID))
        return done(null, username);
    req.logout();
    return done(null, false, { message: "username taken" });
}));

passport.serializeUser((username, done) => { 
    return done(null, username);
});

passport.deserializeUser((username, done) => {
    return done(null, username);
});

module.exports = {
    passport,
    loggedInVerification,
    loggedOutVerification
};