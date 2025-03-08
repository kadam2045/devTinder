const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 10,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 10,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        //db level validation
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please Add Storng Password: ", +value);
        }
      },
    },
    phone: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "I am using DevTinder",
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18 || value > 50) {
          throw new Error("Age should be between 18 and 50");
        }
      },
    },
    gender: {
      type: String,
      require: true,
      trim: true,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Invalid gender", value);
        }
      },
    },
    skills: {
      type: [String],
      // default: ["Javascript", "React", "Node", "MongoDB"],
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "shubhamsecretkey", {
    expiresIn: "1d",
  });

  return token;
};

module.exports = mongoose.model("User", UserSchema);
