const express = require("express");
const connectDB = require("./config/database");
const userModel = require("./models/user");
const { valdiationCheck } = require("./utils/validationCheck");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("../src/middleware/userAuth");
const app = express();

app.use(express.json());
app.use(cookie());

app.post("/signup", async (req, res) => {
  try {
    //  first check validation
    valdiationCheck(req.body);
    const { firstName, lastName, email, password, phone, age, gender, skills } =
      req.body;

    //bcrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone,
      age,
      gender,
      skills,
    });

    await user.save(user);

    res.status(201).send("user created successfully");
  } catch (error) {
    res.status(500).send("error creating user" + error.message);
  }
});

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(500).send("Error on getting profile: " + error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await userModel.find({});

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("error fetching user");
  }
});

app.get("/getUser/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      res.status(404).send("user not found");
      return;
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send("error fetching user");
  }
});
//put
app.put("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const allowed_field = [
      "email",
      "gender",
      "age",
      "phone",
      "skills",
      "password",
    ];
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      allowed_field.includes(k)
    );

    const isSkill = data.skills.length < 10;

    if (!isSkill) {
      throw new Error("Skills cannot be more than 10");
    }
    if (!isUpdatedAllowed) {
      throw new Error("Sorry!! you cant update this field");
    }
    const user = await userModel.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.status(200).send("user updated sucessfully");
  } catch (error) {
    res.status(500).send("error updating user" + error);
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.params.id;
  try {
    await userModel.deleteMany();
    res.status(200).send("user deleted successfully");
  } catch (error) {
    throw new Error(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await userModel.deleteOne({ _id: userId });
    res.status(200).send("user deleted sucesssfully");
  } catch (error) {
    throw new Error(error);
  }
});

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
