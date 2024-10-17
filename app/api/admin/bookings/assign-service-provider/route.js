import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse the request body
    const { bookingId, serviceProviderId } = await request.json();

    // Validate input
    if (!bookingId || !serviceProviderId) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId or serviceProviderId" },
        { status: 400 }
      );
    }

    // Find the service provider and booking simultaneously to avoid multiple queries
    const [serviceProvider, booking] = await Promise.all([
      User.findById(serviceProviderId),
      Booking.findById(bookingId),
    ]);

    // Check if the service provider exists
    if (!serviceProvider) {
      return NextResponse.json(
        { success: false, message: "Service provider not found" },
        { status: 404 }
      );
    }

    // Check if the booking exists
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the service provider is already assigned to the booking
    if (serviceProvider.bookings.includes(bookingId)) {
      return NextResponse.json(
        { success: true, message: "Service provider already assigned!" },
        { status: 201 }
      );
    }

    // Add bookingId to the service provider's bookings and save
    serviceProvider.bookings.push(bookingId);
    await serviceProvider.save();

    // Update the booking's availableServiceProviders and save
    booking.availableServiceProviders.push(serviceProvider);
    await booking.save();

    // Return updated bookings
    return NextResponse.json({
      success: true,
      message: `${serviceProvider.name} assigned successfully`,
      booking
    });
  } catch (error) {
    console.error("Error in POST /service-provider-booking:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
