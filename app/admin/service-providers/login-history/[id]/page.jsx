"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { VscLoading } from "react-icons/vsc";

const LoginHistory = dynamic(() => import("@/components/admin/service-provider/LoginHistory"), {
  suspense: true,
});

const Page = () => {
  const { id } = useParams();
  const [firstHalf, setFirstHalf] = useState([]);
  const [secondHalf, setSecondHalf] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await axios.get(`/api/admin/service-providers/history/${id}`);
        const data = await response.data;
        const middleIndex = Math.ceil(data.history.length / 2);
        const first = data.history.slice(0, middleIndex) || [];
        const second = data.history.slice(middleIndex) || [];
        setFirstHalf(first);
        setSecondHalf(second);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [id]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
        <div className="text-lg font-semibold animate-spin my-56">
          <VscLoading size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full mb-10">
      <div className="w-4/5 flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-semibold text-blue-800">Login & Logout History</h1>
        <div className="flex gap-4 w-full">
          <Suspense fallback={<div>Loading history...</div>}>
            <LoginHistory history={firstHalf} />
            <LoginHistory history={secondHalf} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
