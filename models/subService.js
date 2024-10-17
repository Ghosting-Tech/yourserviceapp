import mongoose, { Schema } from "mongoose";

const subServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    icon: {
      type: Object,
    },
    status: {
      type: String,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  {
    timestamps: true,
  }
);

const Sub = mongoose.models.Sub || mongoose.model("Sub", subServiceSchema);

export default Sub;
