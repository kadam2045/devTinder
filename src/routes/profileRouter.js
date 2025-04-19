const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const userAuth = require("../middleware/userAuth");
const {validateEditProfile} = require("../utils/validationCheck");

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(500).send("Error on getting profile: " + error);
  }
});

router.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: ` ${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.get("/feed", async (req, res) => {
  try {
    const user = await userModel.find({});

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("error fetching user");
  }
});

router.get("/feed/:id", async (req, res) => {
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
router.put("/updateUser/:id", async (req, res) => {
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
      "profileImage",
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

router.delete("/delete", async (req, res) => {
  const userId = req.params.id;
  try {
    await userModel.deleteMany();
    res.status(200).send("user deleted successfully");
  } catch (error) {
    throw new Error(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await userModel.deleteOne({ _id: userId });
    res.status(200).send("user deleted sucesssfully");
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
