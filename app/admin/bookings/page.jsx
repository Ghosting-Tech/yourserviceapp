"use client";
import BookingsTable from "@/components/admin/bookings/BookingsTable";
import TableHeading from "@/components/admin/bookings/TableHeading";
import Loading from "@/components/Loading";
import PaginationBtn from "@/components/PaginationBtn";
import axios from "axios";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

function BookingsPageContent() {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/admin/bookings?page=${page}&limit=25&search=${searchQuery}&status=${status}`
      );
      const data = response.data;

      if (!data.success) {
        console.log(data);
        toast.error("Failed to fetch bookings");
      } else {
        setBookings(data.bookings);
        setMeta(data.meta);
      }
    } catch (error) {
      toast.error("Error fetching bookings");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 mb-6">
      <TableHeading
        setSearchQuery={setSearchQuery}
        setStatus={setStatus}
        fetchBookings={fetchBookings}
      />
      <BookingsTable bookings={bookings} />
      <PaginationBtn totalPages={meta.totalPages} />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookingsPageContent />
    </Suspense>
  );
}
