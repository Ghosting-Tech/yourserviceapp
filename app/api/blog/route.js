import connectMongoDB from "@/libs/mongodb";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 9;
    const skip = (page - 1) * limit;
    await connectMongoDB();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    return NextResponse.json(
      {
        data: blogs,
        pagination: {
          totalBlogs,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
