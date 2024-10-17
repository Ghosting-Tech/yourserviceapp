"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
import UserBookingList from "@/components/bookings/user/UserBookingList";
import { toast } from "sonner";
import PaginationBtn from "@/components/PaginationBtn";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const currentPage = searchParams.get("page") || 1;
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const limit = 10; // Items per page

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true); // Show loading indicator before fetching data
      const response = await axios.get(
        `/api/bookings?page=${page}&limit=${limit}`
      );
      const res = response.data;

      if (!res.success) {
        toast.error(res.message);
      }
      console.log(res);
      const { data, meta } = res;
      setBookings(data);
      setTotalPages(meta.totalPages);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
    // Cleanup function to avoid memory leaks
    return () => setLoading(false);
  }, [currentPage]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-lg font-semibold animate-spin my-56">
            <VscLoading size={50} />
          </div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="px-10 flex flex-col gap-4">
          <h2 className="text-3xl text-blue-500 font-semibold text-center">
            Your Bookings!
          </h2>
          <div className="h-px bg-gray-300 w-full my-4"></div>
          <UserBookingList bookings={bookings} />
          <PaginationBtn totalPages={totalPages} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full my-56">
          <div className="text-lg font-semibold">No bookings found.</div>
        </div>
      )}
    </div>
  );
};

export default Page;
