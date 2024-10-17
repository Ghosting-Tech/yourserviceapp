import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    service_provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
