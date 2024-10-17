"use client";
import Heading from "@/components/admin/blogs/Heading";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaMicroblog } from "react-icons/fa";

export default function Page() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getBlog = async () => {
      try {
        let res = await fetch(`/api/blog/${id}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        res = await res.json();

        console.log(res);

        setData(res);
      } catch (error) {
        toast.error(error);
      }
    };
    getBlog();
  }, [id]);

  if (!data) {
    return (
      <div className="w-full flex gap-1 justify-center items-center my-10 text-2xl text-teal-500">
        <AiOutlineLoading className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-3">
      <Heading
        icon={
          <div className="bg-teal-500 p-1 rounded-full inline-block">
            <FaMicroblog size={20} color="white" />
          </div>
        }
        title={"Blog"}
      />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-3 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Image Section */}
          <div className="relative w-full h-64 sm:h-96 lg:h-[400px]">
            <Image
              src={data.image.url}
              alt="Blog Image"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>

          {/* Title Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
          </div>
          {/* Description Section  */}
          <div className="my-6 mx-4 py-2 px-4 border-l-4 text-gray-400 border-gray-500 italic text-lg">
            &quot;{data.description}&quot;
          </div>

          {/* Content Section */}
          <div className="text-lg text-gray-700 space-y-6">
            <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
