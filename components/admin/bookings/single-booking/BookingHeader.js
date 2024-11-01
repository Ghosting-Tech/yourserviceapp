import React from "react";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";

const BookingHeader = ({ booking }) => {
  const handleDownload = () => {
    window.print();
  };

  const user = useSelector((state) => state.user.user);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Booking ID: {booking.bookingId}</h2>
      <div className="flex items-center gap-2">
        <div
          className={`text-xs px-4 py-2 rounded-full ${
            booking.status === "Request sended to service provider!"
              ? "bg-orange-500 text-white"
              : booking.status === "Service provider has been reached!"
              ? "bg-lime-600 text-white"
              : booking.status === "Payment failed!"
              ? "bg-red-500 text-white"
              : booking.status === "Invoice Paid!"
              ? "bg-green-500 text-white"
              : booking.completed && "bg-teal-500 text-white"
          }`}
        >
          {booking.status == "Request sended to service provider!" &&
          user.role !== "user"
            ? "New Booking request"
            : booking.status}
        </div>
        <Button color="blue" size="sm" onClick={handleDownload}>
          Print This page
        </Button>
      </div>
    </div>
  );
};

export default BookingHeader;
