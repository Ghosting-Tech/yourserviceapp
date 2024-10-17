import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const user = await isLoggedIn(request);
  if (user.success) {
    await connectMongoDB();
    await User.findByIdAndUpdate(
      user.user._id,
      { lastVisit: new Date() },
      { new: true }
    );
  }
  return NextResponse.json(user);
}
