import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

const handleSendNotification = async (token, title, message, link) => {
  if (!token) {
    console.error("No token available for notifications");
    return;
  }

//   console.log(token, link);

  const response = await fetch(
    `${process.env.PHONEPE_REDIRECT_URL}/api/send-notification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        title,
        message,
        link,
      }),
    }
  );

  await response.json();
};

export async function POST(request) {
  await connectMongoDB();
  const { phoneNumber, title, message, link } = await request.json();
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return NextResponse.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const token = user.notificationToken;
  handleSendNotification(token, title, message, link);

  if (!user) {
    return NextResponse.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return NextResponse.json(user, { status: 201 });
}
