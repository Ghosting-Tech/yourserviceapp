import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Connect to MongoDB
  await connectMongoDB();

  // Extract query parameters

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "both";

  // Set up default pagination variables
  const skip = (page - 1) * limit; // Calculate how many items to skip for the current page

  // Build the query object
  let query = { role: "service-provider" };

  // Apply status filter
  if (status !== "both") {
    query.active = status === "active";
  }

  // Apply search filter
  if (search !== "") {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      // Add more fields if needed
    ];
  }

  // Get the users with pagination, search, and sorting
  const users = await User.find(query)
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limit);

  // Get the total count for pagination
  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  // Return the filtered, sorted, and paginated users
  return NextResponse.json({
    success: true,
    users,
    meta: {
      totalUsers,
      totalPages,
      currentPage: page,
    },
  });
}

export async function POST(request) {
  const data = await request.json();
  // console.log(data);
  await connectMongoDB();
  await User.findByIdAndUpdate(data._id, data);
  return NextResponse.json("Service Provider Updated", { status: 201 });
}

export async function DELETE(request) {
  const data = await request.json();
  // console.log(data);
  await connectMongoDB();
  await User.findByIdAndDelete(data._id);
  return NextResponse.json("Service Provider Deleted", { status: 201 });
}
