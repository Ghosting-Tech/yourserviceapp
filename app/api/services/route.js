import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongoDB();
  const user = await isLoggedIn(request);
  let query = {};

  if (user?.user?.role === "admin") {
    query = {}; // No filter for admin
  } else {
    query = { status: "active" };
  }

  let services = await Service.find(query).populate("subServices");

  if (user?.user?.role !== "admin") {
    services = services.map((service) => {
      service.subServices = service.subServices.filter(
        (subService) => subService.status === "active"
      );
      return service;
    });
  }

  return NextResponse.json(services, { status: 200 });
}

export async function POST(request) {
  const { name, status, rank, tags, icon, images } = await request.json();
  
  await connectMongoDB();
  const service = await Service.create({
    name,
    status,
    rank,
    tags,
    icon,
    images,
  });
  return NextResponse.json(service, { status: 201 });
}
