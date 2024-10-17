"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import ServiceProviderBookingList from "@/components/bookings/service-provider/ServiceProviderBookingList";
import { useSearchParams } from "next/navigation";
import { FaAngleDoubleRight } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import PaginationBtn from "@/components/PaginationBtn";

const Booking = () => {
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
    <div className="min-h-screen flex flex-col justify-between">
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
          <ServiceProviderBookingList booking={bookings} />
          <PaginationBtn totalPages={totalPages} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-32">
          <div className="text-2xl font-semibold text-gray-700 mb-2 flex items-center gap-2 ">
            🫠 Uh oh
          </div>
          <div className="mb-4">You have no service request yet!</div>
          <ul className="bg-white p-4 rounded-lg shadow-sm w-full max-w-lg">
            <p className="text-lg font-semibold text-indigo-500 mb-2">
              📈 Tips to get more bookings:
            </p>
            <li className="text-gray-600 mb-2 flex items-center gap-2">
              <FaAngleDoubleRight className="text-indigo-500" />
              Try adding as many services as you can.
            </li>
            <li className="text-gray-600 mb-2 flex items-center gap-2">
              <FaAngleDoubleRight className="text-indigo-500" />
              Try a wide range of locations where you are available.
            </li>
            <li className="text-gray-600 flex items-center gap-2">
              <FaAngleDoubleRight className="text-indigo-500" />
              Your location is only valid within a 15km radius.
            </li>
            <Link href={`/service-provider`}>
              <Button variant="gradient" color="blue" className="mt-6 rounded">
                Go to profile
              </Button>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Booking;
