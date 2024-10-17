import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Blog from "@/models/blog";

export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();

    const blog = await Blog.create(data);

    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
