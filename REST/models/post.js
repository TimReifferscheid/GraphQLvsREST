module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comments: {
      comment: { type: String },
      creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      timestamps: true
    }
  },
  { timestamps: true }
);
