const express = require("express");
const app = express();
//socket.io uses http server to connect
const port = process.env.PORT || 5000;
const server = require("http").Server(app);

//Express View Engine for Handlebarss
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index.handlebars");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
