const express_session = require("express-session");
const express = require("express");
const bodyParser = require('body-parser');
const auth = require("./authentication");

const session_manager = express_session({
    secret: auth.session_secret,
    resave: true,
    saveUninitialized: false
})
//**********************************************************/
//**********************************************************/
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session_manager);
app.use(auth.passport.initialize());
app.use(auth.passport.session());

//**********************************************************/
module.exports = app;
module.exports.session_manager = session_manager;