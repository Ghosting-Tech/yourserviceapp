import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  //   console.log(id);
  await connectMongoDB();
  const booking = await Booking.findById(id).populate("availableServiceProviders");
  if (!booking) {
    return NextResponse.status(404).json({
      success: false,
      message: "Booking not found",
    }); // 404 Not Found status code
  }
  return NextResponse.json(
    {
      success: true,
      message: "Booking found",
      booking,
    },
    { status: 201 }
  );
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  await connectMongoDB();
  const updatedBooking = await Booking.findByIdAndUpdate(id, data, {
    new: true,
  });
  return NextResponse.json(updatedBooking, { status: 201 });
}
