import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    // Query directly for service providers
    const serviceProviders = await User.find({ role: "service-provider" });

    return NextResponse.json(serviceProviders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service providers" },
      { status: 500 }
    );
  }
}
