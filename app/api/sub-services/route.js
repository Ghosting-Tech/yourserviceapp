import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import Sub from "@/models/subService";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, description, price, status, serviceId, icon } =
    await request.json();
  await connectMongoDB();

  // console.log({ name, description, price, status, serviceId, icon });

  if (!name || !description || !price || !status || !serviceId) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  if (!icon) {
    return NextResponse.json(
      { success: false, message: "Upload the icon" },
      { status: 400 }
    );
  }

  const sub = await Sub.create({
    name,
    description,
    price,
    icon,
    status,
    serviceId,
  });

  const service = await Service.findById(serviceId);
  service.subServices.push(sub._id);
  await service.save();

  const latestService = await Service.findById(serviceId).populate(
    "subServices"
  );

  return NextResponse.json(latestService, { status: 201 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  await connectMongoDB();
  await Sub.findByIdAndDelete(id);
  return NextResponse.json(
    { success: true, message: "Successfully Deleted the service" },
    { status: 201 }
  );
}

export async function PUT(request) {
  const data = await request.json();
  await connectMongoDB();
  const serv = await Sub.findByIdAndUpdate(data._id, data, {
    new: true,
  });
  return NextResponse.json(serv, { status: 201 });
}
