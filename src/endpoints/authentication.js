const set = (app, passport) => {

    app.get("/", (req, res) => {
        if (req.isAuthenticated())
            res.send('<h1>authenticated</h1><br/><form action="http://localhost:3000/leave" method="post"><input type="submit" value="logout" /></form>');
        else
            res.send('<h1>NOT authenticated</h1><br/><form action="http://localhost:3000/join" method="post"><label for="username">Username:</label><br/><input type="text" name="username" /> <br/><input type="submit" value="submit" /></form>');
    });

    app.post("/leave", (req, res) => {
        if (req.isAuthenticated()) {
            req.logout();
            res.status(200).redirect("/");
        } else {
            res.sendStatus(401);
        }
    });

    app.post("/join", passport.authenticate('local'), (req, res) => {
        res.redirect("/");
    });

}

module.exports = { set };