import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { phoneNumber, email } = await request.json();
  await connectMongoDB();
  
  const phoneExist = await User.findOne({ phoneNumber });
  if (phoneExist) {
    return NextResponse.json({
      success: false,
      message: "Phone Number already exists",
    });
  }

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return NextResponse.json({
      success: false,
      message: "Email already exists",
    });
  }

  return NextResponse.json(
    { success: true, message: "Generating OTP" },
    { status: 201 }
  );
}
