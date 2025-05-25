const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(
      process.env.DATABASE_CONNECTION_STRING,
    );
    console.log("database connected successfully");
  } catch (error) {
    console.log("error connecting database in databse file", error);
  }
 
};

module.exports = connectDB;
