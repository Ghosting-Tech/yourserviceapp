import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, status, description, rank, tags, icon, images } =
    await request.json();

  await connectMongoDB();
  const service = await Service.create({
    name,
    status,
    description,
    rank,
    tags,
    icon,
    images,
  });
  return NextResponse.json(service, { status: 201 });
}
