import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 100);

    const data = await request.json();
    await connectMongoDB();

    const user = await isLoggedIn(request);

    // Define the base match query for services
    let matchQuery = {};
    if (user?.user?.role !== "admin") {
      if (!data.city) {
        return NextResponse.json(
          { error: "City is required for non-admin users." },
          { status: 400 }
        );
      }
      matchQuery = { status: "active", cities: data.city };
    }

    // Use aggregation pipeline to match and conditionally filter sub-services
    const services = await Service.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "subservices", // the name of the sub-services collection
          localField: "subServices",
          foreignField: "_id",
          as: "subServices",
        },
      },
      ...(user?.user?.role !== "admin"
        ? [
            {
              $set: {
                subServices: {
                  $filter: {
                    input: "$subServices",
                    as: "subService",
                    cond: { $eq: ["$$subService.status", "active"] },
                  },
                },
              },
            },
          ]
        : []),
    ]);

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching services." },
      { status: 500 }
    );
  }
}
