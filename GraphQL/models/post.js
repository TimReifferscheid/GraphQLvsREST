const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: { type: String, required: true }
    },
    href: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
