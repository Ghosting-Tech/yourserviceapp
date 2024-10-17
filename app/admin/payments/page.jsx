"use client";
import Loading from "@/components/Loading";
import PaginationBtn from "@/components/PaginationBtn";
import axios from "axios";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import PaymentTable from "@/components/payment/PaymentTable";
import TableHeading from "@/components/payment/TableHeading";

const PaymentsPageContent = () => {
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("both");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  const fetchingData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/payment?page=${page}&limit=25&search=${searchQuery}&status=${status}`
      );

      const data = response.data;

      if (!data.success) {
        toast.error("Failed to fetch payments");
      } else {
        setPayments(data.data);
        setMeta(data.meta);
      }
    } catch (error) {
      toast.error("Error fetching payments");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, status]);

  const updatePayment = async (updatedData) => {
    try {
      // Make the PUT request to update the payment
      const response = await axios.put(`/api/payment`, updatedData);
      const data = response.data;

      // If the update was successful, update the payments state
      if (data.success) {
        toast.success(data.message);
        setPayments((prev) =>
          prev.map((payment) =>
            payment._id === updatedData._id ? updatedData : payment
          )
        );
      } else {
        // Handle case where success is false, but no error (optional)
        toast.error(data.message);
      }
    } catch (err) {
      // Catch and handle any errors
      toast.error("Error updating payment");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 mb-6">
      <TableHeading
        setSearchQuery={setSearchQuery}
        setStatus={setStatus}
        fetchingData={fetchingData}
      />
      <PaymentTable payments={payments} updatePayment={updatePayment} />
      <PaginationBtn totalPages={meta.totalPages} />
    </div>
  );
};

export default function Payment() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentsPageContent />
    </Suspense>
  );
}
