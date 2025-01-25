const express = require("express");

const app = express();

app.get("/api/:userID", (req, res) => {
  console.log("reqq", req.query);
  console.log("req params", req.params);
  res.send("Hello World from API");
});

app.listen(7777, () => {
  console.log("server is running on 777 port");
});
