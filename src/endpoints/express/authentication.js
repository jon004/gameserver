const net = require('../../utils/network');
const db = require('../../databases/usernamedb');
const app = require('../../express');
const auth = require('../../middleware/authentication');

const passport = auth.passport;

app.get("/", (req, res) => {
    console.log(`GET /  client ip is... ${req.ip}`); 
    if (req.isAuthenticated()) {
        res.send(`
            <div id="container">
                <h1>authenticated as <span id="username" style="color:blue;">${req.user}</span></h1><br/>
                <div id="chat" style="overflow-y: scroll; width: 420px; height: 120px;">
                </div>
                <input id="txt" type="text"><button onclick="chat()">send</button>
                <form action="http://${net.host}:${net.port}/logout?redirect=true" method="post">
                    <input type="submit" value="logout" />
                </form>
                <div>
                    <h3>Online <span id="total_online"></span></h3>
                    <div id="names"></div>
                </div>
            </dib>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js" integrity="sha512-MgkNs0gNdrnOM7k+0L+wgiRc5aLgl74sJQKbIWegVIMvVGPc1+gc1L2oK9Wf/D9pq58eqIJAxOonYPVE5UwUFA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script>
                let username = document.getElementById("username").innerHTML;
                let socket = io('ws://${net.host}:${net.port}');
                
                socket.on("chat", (user, msg) => {
                    let chat = document.getElementById("chat");
                    let needs_scroll = (chat.scrollTop === chat.scrollTopMax)
                    let d = new Date();
                    let ts = "<span style='color:#7188c5;'>[" + d.getHours() + ":" + d.getMinutes() +":" + d.getSeconds() + "]</span>";
                    let uname_color = (username == user) ? "blue" : ("server" == user) ? "black" : "red";
                    chat.innerHTML = chat.innerHTML + ts + " <span style='color:" + uname_color + "'>" + user + "</span>: ";
                    chat.innerHTML = chat.innerHTML + msg.trim() + "<br/><br/>";
                    if (needs_scroll) chat.scroll(0, chat.scrollTopMax);
                });

                socket.on("online", (online) => {
                    let online_count = document.getElementById("total_online");
                    online_count.innerHTML = online.length;
                    let unames = document.getElementById("names");
                    unames.innerHTML = online.sort().map(u => { 
                        if (u == username)
                            return u + " <span style='color: green;'>(you)</span><br/>"
                        return u + "<br/>" 
                    }).join("");
                })

                socket.on("disconnect", () => {
                    document.getElementById('container').innerHTML = "<h1>connection lost</h1><h3>try refreshing the page</h3>";
                });

                function chat() {
                    let txt = document.getElementById("txt");
                    if (txt.length === 0) return;
                    socket.emit("chat", txt.value);
                    txt.value = "";
                }
            </script>
        `);
    } else {
        res.send(`
            <h1>NOT authenticated</h1><br/>
            <form action="http://${net.host}:${net.port}/login?redirect=true" method="post">
                <label for="username">Username:</label><br/>
                <input type="text" name="username" /><br/>
                <input type="submit" value="submit" />
            </form>
        `);
    }
});

app.post("/logout", auth.loggedInVerification, (req, res) => {
    db.delUser(req.sessionID);
    req.logout();
    if (req.query.redirect == "true") {
        res.redirect("/");
    } else {
        res.sendStatus(200);
    }
});

app.post("/login", auth.loggedOutVerification, passport.authenticate('local'), (req, res) => {
    if (req.query.redirect == "true") {
        res.redirect("/");
    } else {
        res.sendStatus(200);
    }
});