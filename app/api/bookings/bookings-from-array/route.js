export async function GET(request) {
  try {
    // Ensure the MongoDB connection is established
    await connectMongoDB();

    const bookings = await request.json();

    // Extract page and limit from the request query, with default values
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the bookings using the $in operator with pagination
    const services = await Booking.find({ _id: { $in: bookings } })
      .sort({ createdAt: -1 })
      .skip(skip) // Skip the specified number of documents
      .limit(limit) // Limit the number of documents returned
      .lean(); // Return plain JavaScript objects for faster performance

    // Get the total count for pagination
    const totalBookings = await Booking.countDocuments({
      _id: { $in: bookings },
    });
    const totalPages = Math.ceil(totalBookings / limit);

    return NextResponse.json(
      {
        success: true,
        data: services,
        meta: {
          currentPage: page,
          totalPages,
          totalBookings,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
