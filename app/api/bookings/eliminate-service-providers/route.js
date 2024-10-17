import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB connection is established

    const { eliminateServiceProviders, bookingId, serviceProvider } =
      await request.json();

    const service = await Booking.findById(bookingId);

    if (!service) {
      return NextResponse.json("Invalid booking ID", { status: 404 });
    }

    if (service.acceptedByServiceProvider) {
      return NextResponse.json(
        {
          success: false,
          message: "Service has been accepted by another service provider!",
          acceptedByAnotherServiceProvider: true,
        },
        { status: 200 }
      );
    }
    if (eliminateServiceProviders.length > 0) {
      eliminateServiceProviders.map(async (sp) => {
        await User.findByIdAndUpdate(sp, { $pull: { bookings: bookingId } });
      });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        acceptedByServiceProvider: true,
        assignedServiceProviders: serviceProvider,
        status: "Service is not started",
        availableServiceProviders: [serviceProvider],
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Bookings updated successfully",
        booking: updatedBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error updating bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bookings" },
      { status: 500 }
    );
  }
}
