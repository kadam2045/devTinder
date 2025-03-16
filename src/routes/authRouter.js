const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const { valdiationCheck } = require("../utils/validationCheck");
const userModel = require("../models/user");

router.post("/signup", async (req, res) => {
  try {
    //  first check validation
    valdiationCheck(req.body);
    const { firstName, lastName, email, password, phone, age, gender, skills } =
      req.body;

    //bcrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const userData = new userModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone,
      age,
      gender,
      skills,
    });

    await userData.save(userData);

    res.status(201).send("user created successfully");
  } catch (error) {
    res.status(500).send("error creating user" + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if email is present or not
    const isUser = await userModel.findOne({ email: email });

    if (!isUser) {
      throw new Error("Invalid credentional");
    }
    //now compare passoword

    const isPassword = await bcrypt.compare(password, isUser?.password);
    if (!isPassword) {
      throw new Error("Passowrd is wrong");
    }
    if (isPassword) {
      //genrate token
      const token = await isUser.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });

      res.status(200).send("Login sucessfully");
    }
  } catch (error) {
    res.status(500).send("erro login: " + error);
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).send("Logout Sucessfully");
});

router.post("/forgotPassword", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUserStored = await userModel.findOne({ email: email });

    if (!isUserStored) {
      throw new Error("Invalid Email: ");
    }

    //bcrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    //now store this new password in our db
    const updatedPassword = await userModel.findOneAndUpdate(
      { email },
      { password: hashPassword }
    );

    console.log("updatedPassword", updatedPassword);

    res.status(200).send(`Password updated successfully `);
  } catch (error) {
    res.status(500).send("Error updating password: " + error.message);
  }
});

module.exports = router;
