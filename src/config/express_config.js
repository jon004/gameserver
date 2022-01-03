const session = require("express-session");
const express = require("express");
const bodyParser = require('body-parser');
const auth = require("./passport_config");

//**********************************************************/
//**********************************************************/
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: auth.session_secret,
    resave: true,
    saveUninitialized: false
}));
app.use(auth.passport.initialize());
app.use(auth.passport.session());

//**********************************************************/

module.exports = { 
    app,
    auth
};