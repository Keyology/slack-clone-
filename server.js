const express = require("express");
const app = express();
//socket.io uses http server to connect
const port = process.env.PORT || 5000;
const server = require("http").Server(app);

//Socket.io
const io = require("socket.io")(server);
let onlineUsers = {};
io.on("connection", socket => {
  require("./sockets/chat")(io, socket, onlineUsers);
});

//Express View Engine for Handlebarss
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.render("index.handlebars");
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });
