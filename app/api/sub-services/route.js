import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import Sub from "@/models/subService";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, price, status, serviceId, icon } = await request.json();
  await connectMongoDB();
  const sub = await Sub.create({
    name,
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
