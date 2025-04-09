const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, // hai asa ka lihla and yane konta schema betho kasa kalnar
      required: true,
      index: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
ConnectionRequestSchema.pre("save", function (next) {
  const req = this;
  if (req.fromUserId.equals(req.toUserId)) {
    throw new Error("Cannot send req to yourself");
  }
  next();
});
module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
