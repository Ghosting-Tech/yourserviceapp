import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || 1, 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || 10, 10); // Default to 10 records per page
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "both";

    // Set up default pagination variables
    const skip = (page - 1) * limit; // Calculate how many items to skip for the current page

    // Build the match query object
    let matchQuery = {};

    // Apply status filter
    if (status !== "both") {
      matchQuery.paid = status === "true"; // Handle boolean status
    }

    // Use aggregation for advanced querying on referenced fields
    const pipeline = [
      {
        $lookup: {
          from: "users", // Name of the User collection in MongoDB
          localField: "service_provider",
          foreignField: "_id",
          as: "service_provider",
        },
      },
      {
        $unwind: "$service_provider", // Flatten the array returned from the $lookup
      },
      {
        $match: matchQuery, // Apply status filter
      },
    ];

    // Apply search filter for service provider name or phone number
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "service_provider.name": { $regex: search, $options: "i" } }, // Search by name
            {
              "service_provider.phoneNumber": { $regex: search, $options: "i" },
            }, // Search by phone number
          ],
        },
      });
    }

    // Pagination and sorting
    pipeline.push(
      { $sort: { createdAt: -1 } }, // Sort by latest payments
      { $skip: skip }, // Skip for pagination
      { $limit: limit } // Limit for pagination
    );

    // Execute the aggregation pipeline
    const payments = await Payment.aggregate(pipeline);

    // Get total number of payment records (without pagination)
    const totalPayments = await Payment.countDocuments(matchQuery);

    // Return the paginated payments with meta information
    return NextResponse.json(
      {
        success: true,
        message: "Payments fetched successfully",
        data: payments,
        meta: {
          totalPayments,
          currentPage: page,
          totalPages: Math.ceil(totalPayments / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors, return an error response with 500 status
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching payments",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Connect to MongoDB if not already connected
    await connectMongoDB();

    // Create a new payment record
    const payment = await Payment.create(data);

    // Return the created payment with a 201 status
    return NextResponse.json(
      {
        success: true,
        message: "Successfully completed the service!",
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors, return an error response with 500 status
    return NextResponse.json(
      {
        success: false,
        message: "Error on generating service provider payment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();

    // Connect to MongoDB if not already connected
    await connectMongoDB();

    // Create a new payment record
    const payment = await Payment.findByIdAndUpdate(data._id, data, {
      new: true,
    });

    // Return the created payment with a 201 status
    return NextResponse.json(
      {
        success: true,
        message: "Successfully Updated the payment!",
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors, return an error response with 500 status
    return NextResponse.json(
      {
        success: false,
        message: "Error on updating service provider payment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
