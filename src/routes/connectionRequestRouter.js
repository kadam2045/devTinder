const express = require("express");
const router = express.Router();
const connectionRequestModel = require("../models/connectionRequest");
const userAuth = require("../middleware/userAuth");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const userDetails = await User.findById(toUserId);

    const isUserPresent = await User.findById(toUserId);

    if (!isUserPresent) {
      return res.status(500).json({
        message: "User not found!",
      });
    }

    //sender can only send interested and ignore not accept
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(500).json({
        message: `this status ${status} is invalid`,
      });
    }

    //if there is an existing conection request from user
    const existingConnectionRequest = await connectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error(
        "you cant send request to same perosn that you sent or accpted"
      );
    }

    const connectionRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    }); /// new instance of this connection request model

    const data = await connectionRequest.save();

    res.status(200).json({
      message: `${req.user?.firstName} is ${
        status === "interested" ? "shown intersted in" : "ignored"
      } ${userDetails?.firstName} `,
      data,
    });
  } catch (error) {
    res.status(500).send("error " + error);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;

    try {
      const allowedStatus = ["rejected", "accepted"];
      const isStatus = allowedStatus.includes(status);

      if (!isStatus) {
        throw new Error("Status not found");
      }

      const connectionRequest = await connectionRequestModel
        .findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        })
        .populate("fromUserId", ["firstName"]);

      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({
        message: `${loggedInUser.firstName} is ${status} request`,
        data,
      });
    } catch (error) {
      res.status(500).send("Error :" + error);
    }
  }
);

module.exports = router;
