const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const connectionRequestModel = require("../models/connectionRequest");

router.get("/user/request/recived", userAuth, async (req, res) => {
  const LoggedInUser = req.user;

  try {
    const isrecivedData = await connectionRequestModel
      .find({
        toUserId: LoggedInUser,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName", "age", "gender"])
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
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data2 = getUserConnectionData.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser?._id.toString()) {
        return row?.toUserId;
      }
      return row?.fromUserId;
    });

    res.json({
      data2,
    });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

module.exports = router;
