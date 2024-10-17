import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  // console.log(id);
  await connectMongoDB();
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.status(404).json({ success: false, message: "User not found" }); // Return 404 Not Found if user not found.  //
  }
  return NextResponse.json(user, { status: 201 });
}
