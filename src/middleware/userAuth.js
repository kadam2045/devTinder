const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies|| req.headers;

    if (!token) {
     return res.status(401).send("token is not valid");
    }

    const verifyToken = jwt.verify(token, "shubhamsecretkey");
    const { _id } = verifyToken;
    //now as we get id from token now we need to check is this user is in database
    const user = await userModel.findById(_id);

    if (!user) {
      throw new Error("user not found");
    }

    req.user = user; // it will add user in req
    next();
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
};

module.exports = userAuth;
