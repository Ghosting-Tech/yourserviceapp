import { sendSMS } from "@/libs/sendSMS";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { number, message, templateid } = await req.json();

    if (!number || !message || !templateid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    const result = await sendSMS(number, message, templateid);
    
    return NextResponse.json(
      { success: true, message: "Successfully sent the SMS.", data: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error on sending SMS.", error: error },
      { status: 500 }
    );
  }
}
