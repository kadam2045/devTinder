const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const connectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const { set } = require("mongoose");

router.get("/user/request/recived", userAuth, async (req, res) => {
  const LoggedInUser = req.user;

  try {
    const isrecivedData = await connectionRequestModel
      .find({
        toUserId: LoggedInUser,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName", "age", "gender", "profileImage"])
      .populate("toUserId", ["firstName"]);

    if (isrecivedData.length === 0) {
      throw new Error("no user interested in you");
    }
    res.status(200).json({
      message: "user fetch successfully",
      data: isrecivedData,
    });
  } catch (error) {
    res.status(500).send("error :" + error);
  }
});

router.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const getUserConnectionData = await connectionRequestModel
      .find({
        $or: [
          {
            toUserId: loggedInUser?._id,
            status: "accepted",
          },
          { fromUserId: loggedInUser?._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", ["firstName", "lastName" , "profileImage"])
      .populate("toUserId", ["firstName", "lastName" ,"profileImage"]);

     
    const data = getUserConnectionData.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser?._id.toString()) {
        return row?.toUserId;
      }
      return row?.fromUserId;
    });

    res.json({
      data,
    });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit; // formula

    const connectionRequestData = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: loggedInUser?._id },
          { toUserId: loggedInUser?._id },
        ],
      })
      .select(["toUserId", "fromUserId"]);

    const hideUserFromFeed = new Set();

    const getFeedData = connectionRequestData.forEach((row) => {
      hideUserFromFeed.add(row.toUserId.toString());
      hideUserFromFeed.add(row.fromUserId.toString());
    });

    const getUserData = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },

          { _id: { $ne: loggedInUser?._id } },
        ],
      })
      .skip(skip)
      .limit(limit);

      
   return res.json({
      message: "user fetch successfuly",
      data: getUserData,
    });
  } catch (error) {
    res.status(500).send("error :" + error);
  }
});

module.exports = router;
