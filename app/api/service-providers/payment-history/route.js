import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const user = await isLoggedIn(request);

    if (!user.success) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || 1, 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || 10, 10); // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate how many records to skip for the current page
    const status = searchParams.get("status") || "both";

    // Query for the service providers associated with the logged-in user
    const query = { service_provider: user.user._id };

    if (status !== "both") {
      query.paid = status === "true"; // Handle boolean status
    }

    // Fetch the paginated data
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("service_provider"); // Sort by creation date (most recent first)
    // Get the total count of matching records
    const totalRecords = await Payment.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    // Return the paginated results with meta information
    return NextResponse.json(
      {
        success: true,
        data: payments,
        meta: {
          currentPage: page,
          totalPages,
          totalRecords,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service providers" },
      { status: 500 }
    );
  }
}
