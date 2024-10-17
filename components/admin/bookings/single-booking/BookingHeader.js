import React from "react";
import { Button } from "@material-tailwind/react";

const BookingHeader = ({ booking }) => {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Booking ID: {booking.bookingId}</h2>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-4 py-2 rounded-full ${
            booking.paid
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {booking.status}
        </span>
        <Button color="blue" size="sm" onClick={handleDownload}>
          Print This page
        </Button>
      </div>
    </div>
  );
};

export default BookingHeader;
