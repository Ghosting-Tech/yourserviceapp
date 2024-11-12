import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, phoneNumber, email, password } = await request.json();
  if (!name) {
    return NextResponse.json({
      success: false,
      message: "Name is required",
    });
  }
  if (!phoneNumber) {
    return NextResponse.json({
      success: false,
      message: "Phone Number is required",
    });
  }
  if (!email) {
    return NextResponse.json({
      success: false,
      message: "Email is required",
    });
  }
  if (!password) {
    return NextResponse.json({
      success: false,
      message: "Password is required",
    });
  }

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
  await connectMongoDB();
  const user = await User.create({
    name,
    email,
    phoneNumber,
    gender: "Unspecified",
    location: "Unspecified",
    city: "Unspecified",
    active: true,
    role: "user",
    password,
    image: {
      url: "",
      name: "",
    },
  });
  return NextResponse.json(
    {
      success: true,
      message: "Registered successfully",
    },
    { status: 200 }
  );
}
