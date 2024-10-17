import mongoose, { Schema } from "mongoose";
import Counter from "./counter";

const bookingSchema = new Schema(
  {
    bookingId: { type: String, unique: true },
    cartItems: {
      type: [],
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Payment failed!",
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    fullname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      type: String,
    },
    profileImage: {
      type: Object,
    },
    feedback: {
      type: String,
    },
    sendedToServiceProvider: {
      type: Boolean,
      default: false,
    },
    acceptedByServiceProvider: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    paymentMethod: { type: String },
    verificationImage: {
      type: Object,
      default: {
        url: "",
        name: "",
      },
    },
    availableServiceProviders: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Now "Sub" will be properly recognized
      },
    ],
    invoices: {
      type: {
        title: String,
        date: String,
        time: String,
        paymentMethod: { type: String },
        transactionId: { type: String },
        paid: { type: Boolean },
        status: { type: String, default: "Not Accepted Yet!", required: true },
        items: [
          {
            description: String,
            quantity: String,
            unitPrice: String,
            amount: String,
          },
        ],
        total: String,
      },
    },
    assignedServiceProviders: {
      type: Object,
    },
    location: {
      type: Object,
    },
    noServiceProviderAvailable: { type: Boolean, default: false },
    canceledByCustomer: { type: String, default: "" },
    serviceCompletedOtp: { type: String },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "bookingId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.bookingId = counter.value;
  }
  next();
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
