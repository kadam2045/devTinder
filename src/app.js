const express = require("express");
const connectDB = require("./config/database");
const cookie = require("cookie-parser");
const app = express();
const authRoutes = require("../src/routes/authRouter");
const profileRoutes = require("../src/routes/profileRouter");

app.use(express.json());
app.use(cookie());

app.use("/", authRoutes);
app.use("/", profileRoutes);

connectDB() // first db connect then server on
  .then(() => {
    console.log("database connected successfully");
    app.listen(7777, () => {
      console.log("server is running on 777 port");
    });
  })
  .catch((err) => {
    console.log("error connecting database", err);
  });
