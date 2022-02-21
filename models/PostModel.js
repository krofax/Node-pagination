const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: true,
  },
  body: {
    type: "string",
    required: true,
  },

  userId: {
    type: "string",
    required: true,
  },
});

const PostModel = mongoose.model("posts", postSchema);

exports.PostModel = PostModel;
