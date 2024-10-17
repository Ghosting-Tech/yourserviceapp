import mongoose, { Schema } from "mongoose";
import Sub from './subService'; // Import the Sub model

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: Object,
    },
    status: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    bookings: {
      type: Array,
      default: [],
    },
    subServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sub", // Now "Sub" will be properly recognized
      },
    ],
    reviews: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
