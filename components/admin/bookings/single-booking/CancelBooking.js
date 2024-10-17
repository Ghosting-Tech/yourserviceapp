import React from "react";
import { GoAlertFill } from "react-icons/go";
import { LuArrowBigRightDash } from "react-icons/lu";

const CancelBooking = ({ booking }) => {
  return (
    <div>
      {booking.canceledByCustomer && (
        <div className="bg-white p-6 rounded-lg shadow w-full mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Booking has been canceled!
          </h3>
          <div className="my-4 bg-red-50 text-red-500 text-sm p-4 rounded-lg flex gap-2 items-center">
            <GoAlertFill />
            This booking has been canceled by the customer.
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm text-gray-500">Reason for Cancellation:</h3>
            <div className="flex gap-1 items-center">
              <LuArrowBigRightDash />
              <p>{booking.canceledByCustomer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelBooking;
