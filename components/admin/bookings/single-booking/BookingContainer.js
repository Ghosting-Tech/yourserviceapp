"use client";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ServiceDetails from "./ServiceDetails";
import LocationDetails from "./LocationDetails";
import BookingDetails from "./BookingDetails";
import InvoiceDetail from "./InvoiceDetail";
import BookingHeader from "./BookingHeader";
import AvailableServiceProviders from "./AvailableServiceProviders";
import UserServiceProviderDetail from "./UserServiceProviderDetail";
import CancelBooking from "./CancelBooking";

const BookingContainer = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchingBooking = useCallback(async () => {
    try {
      const response = await fetch(`/api/bookings/${id}`);
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
      }
      console.log(data.booking);
      setBooking(data.booking);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchingBooking();
  }, [fetchingBooking]);

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto my-6">
      <BookingHeader booking={booking} />

      <BookingDetails booking={booking} />

      <CancelBooking booking={booking} />

      <UserServiceProviderDetail setBooking={setBooking} booking={booking} />

      <ServiceDetails booking={booking} />

      <InvoiceDetail booking={booking} />

      <LocationDetails booking={booking} />

      <AvailableServiceProviders
        availableServiceProviders={booking.availableServiceProviders}
      />
    </div>
  );
};

export default BookingContainer;
