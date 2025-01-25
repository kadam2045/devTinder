const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello word from devtinder");
});

app.get("/api", (req, res) => {
  res.send("hello word from api");
});

app.listen(7777, () => {
  console.log("server is running on 777 port");
});
