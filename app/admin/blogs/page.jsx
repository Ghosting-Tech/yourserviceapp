import Loading from "@/components/Loading";
import React, { Suspense } from "react";

const BlogContainer = React.lazy(() => {
  return import("@/components/admin/blogs/BlogContainer");
});

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <BlogContainer />
    </Suspense>
  );
};

export default page;
