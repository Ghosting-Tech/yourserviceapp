import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import formatDate from "@/utils/formatDate";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectMongoDB();
  const { id } = params;

  const history = await User.findById(id, "name loginHistory").lean();

  // Format the data with user login history and formatted timestamp
  const formattedHistory = history.loginHistory.map((event) => ({
    userId: {
      _id: history._id,
      name: history.name,
    },
    eventType: event.eventType,
    timestamp: formatDate(event.timestamp),
  }));

  return NextResponse.json({ history: formattedHistory });
}
