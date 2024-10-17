import connectMongoDB from "@/libs/mongodb";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    }

    const data = await request.json();

    await connectMongoDB();
    const blog = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json("Blog deleted successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
