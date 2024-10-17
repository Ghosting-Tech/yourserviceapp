import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit")) || 10;
  await connectMongoDB();

  const user = await isLoggedIn(request);
  let query = {};

  if (user?.user?.role === "admin") {
    query = {}; // No filter for admin
  } else {
    query = { status: "active" };
  }

  let services = await Service.find(query).sort({
    createdAt: -1,
  })
  .limit(limit).populate("subServices");

  if (user?.user?.role !== "admin") {
    services = services.map((service) => {
      service.subServices = service.subServices.filter(
        (subService) => subService.status === "active"
      );
      return service;
    });
  }
  return NextResponse.json(services, { status: 201 });
}
