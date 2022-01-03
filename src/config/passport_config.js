require('dotenv').config({ path: "./local.env" });
const session_secret = process.env.SESSION_SECRET;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//****************************************************************//

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "username"
}, (username, password, done) => {
    return done(null, username);
}));

passport.serializeUser((username, done) => { 
    return done(null, username);
});

passport.deserializeUser((username, done) => {
    return done(null, username);
});

module.exports = {
    passport,
    session_secret,
};