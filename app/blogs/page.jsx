import BlogCard from "@/components/admin/blogs/BlogCard";
import Loading from "@/components/Loading";
import PaginationBtn from "@/components/PaginationBtn";
import React, { Suspense } from "react";

async function getBlogs(page = 1, limit = 9) {
  try {
    const res = await fetch(
      `${process.env.PHONEPE_REDIRECT_URL}/api/blog?page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
const page = async ({ searchParams: { page, size } }) => {
  const blogs = await getBlogs(page, size);
  if (!blogs) {
    return <Loading />;
  }
  return (
    <main className="relative p-4 sm:p-8 bg-gray-50">
      <h2 className="text-2xl lg:text-4xl font-bold text-center text-teal-500 font-aclonica leading-tight mb-4 sm:mb-8">
        All Blogs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 place-items-center md:place-items-start px-2 sm:px-5 ">
        {blogs?.data?.map((blog) => (
          <BlogCard key={blog._id} blog={blog} page="user" />
        ))}
      </div>
      <div className="mt-3">
        <PaginationBtn totalPages={blogs.pagination?.totalPages} />
      </div>
    </main>
  );
};

export default page;
