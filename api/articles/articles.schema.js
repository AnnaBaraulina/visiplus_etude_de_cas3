const { Schema, model } = require("mongoose");

const articleSchema = Schema(
  {
    title: String,
    content: String,
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

let Article;

module.exports = Article = model("Article", articleSchema);