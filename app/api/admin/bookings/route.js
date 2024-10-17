import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Connect to MongoDB
  await connectMongoDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  // Set up default pagination variables
  const skip = (page - 1) * limit; // Calculate how many items to skip for the current page

  // Build the query object
  let query = {};

  // Apply status filter
  if (status !== "all") {
    query.completed = status === "completed";
  }

  // Apply search filter
  if (search !== "") {
    query.$or = [
      { bookingId: { $regex: search, $options: "i" } },
      { fullname: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
      // Add more fields if needed
    ];
  }

  // Get the bookings with pagination, search, and sorting
  const bookings = await Booking.find(query)
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limit);

  // Get the total count for pagination
  const totalBookings = await Booking.countDocuments(query);
  const totalPages = Math.ceil(totalBookings / limit);

  // Return the filtered, sorted, and paginated bookings
  return NextResponse.json({
    success: true,
    bookings,
    meta: {
      totalBookings,
      totalPages,
      currentPage: page,
    },
  });
}
