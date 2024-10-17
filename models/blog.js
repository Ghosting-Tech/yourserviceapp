import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        ref: "",
      },
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
