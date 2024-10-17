"use client";
import { useState, useEffect } from "react";
import { Carousel } from "@material-tailwind/react";
import Link from "next/link";
import BlogCard from "./admin/blogs/BlogCard";

// Function to fetch the blogs
async function getBlogs() {
  const res = await fetch(`/api/blog`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]); // Use state to store blogs

  useEffect(() => {
    // Fetch blogs on component mount
    const fetchBlogs = async () => {
      const blogData = await getBlogs();
      setBlogs(blogData);
    };

    fetchBlogs();
  }, []); // Empty dependency array ensures this runs only once on mount
  if (blogs.length === 0) {
    return null;
  }
  return (
    <>
      <section className="bg-white text-black py-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-500">
            <strong>Latest Blogs</strong>
          </h2>
          <p className="mt-4 text-gray-600">
            <strong>
              That&apos;s the main thing people are controlled by! Thoughts -
              their perception of themselves!
            </strong>
          </p>
        </div>

        {/* Display blog cards */}
        <div className="container grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-4 w-full mx-auto place-items-center">
          {blogs?.data?.slice(0, 3).map((blog) => (
            <BlogCard key={blog._id} blog={blog} page="user" />
          ))}
        </div>
        <div className="flex justify-center items-center w-full my-6">
          <Link
            href={"/blogs"}
            className="text-sm rounded-full border border-teal-500 capitalize px-6 py-2 hover:shadow-lg hover:bg-teal-500 hover:text-white transition-all duration-300 ease-in-out"
          >
            VIEW MORE
          </Link>
        </div>
      </section>
    </>
  );
}
