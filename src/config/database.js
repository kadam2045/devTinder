const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://shubham:shubham@namastecluster.tckeg.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
