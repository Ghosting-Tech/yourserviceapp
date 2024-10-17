import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import connectMongoDB from "@/libs/mongodb";

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: "Already logged out" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded?.id;

  // Connect to MongoDB
  await connectMongoDB();

  // Find the user and log the logout event
  const user = await User.findById(userId);
  if (user) {
    user.loginHistory.push({ eventType: 'logout' });
    await user.save();
  }

  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the token cookie
  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(0), // Expire the cookie
  });

  return response;
}
