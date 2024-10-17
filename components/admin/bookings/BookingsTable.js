import { Avatar, IconButton } from "@material-tailwind/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import formatDate from "@/utils/formatDate";
import Link from "next/link";

export default function BookingsTable({ bookings }) {
  return (
    <div className="overflow-x-auto p-4 shadow-lg bg-white rounded-lg">
      <div className="min-w-full text-left text-sm">
        <div className="bg-blue-50 hidden md:flex rounded-lg">
          <div className="p-4 font-semibold text-blue-700 w-1/6 text-center">
            Booking ID
          </div>
          <div className="p-4 font-semibold text-blue-700 w-2/6">Booked By</div>
          <div className="p-4 font-semibold text-blue-700 w-1/6 text-center">
            Created Date
          </div>
          <div className="p-4 font-semibold text-blue-700 w-1/6 text-center">
            Status
          </div>
          <div className="p-4 font-semibold text-blue-700 w-1/6 text-center">
            Total Amount
          </div>
          <div className="p-4 font-semibold text-blue-700 w-1/6 text-center">
            Action
          </div>
        </div>

        {bookings.map((booking, index) => (
          <div
            key={booking._id}
            className={`flex flex-col md:flex-row bg-white ${
              index === bookings.length - 1 ? "" : "border-b border-gray-300"
            }`}
          >
            {/* Booking ID */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Booking ID: </span>
              <span className="truncate text-xs">{booking.bookingId}</span>
            </div>

            {/* Booked By */}
            <div className="p-4 w-full md:w-2/6 flex items-center gap-2">
              <span className="font-semibold md:hidden">Booked By: </span>
              {booking.profileImage?.url ? (
                <Avatar src={booking.profileImage.url} size="sm" />
              ) : (
                <div className="w-10 h-10 text-xl text-black rounded-full flex justify-center items-center font-junge bg-gray-400">
                  {booking?.fullname[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{booking.fullname}</p>
                <p className="text-gray-500 text-xs">{booking.phoneNumber}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Created Date: </span>
              <span className="truncate text-xs">
                {formatDate(booking.createdAt)}
              </span>
            </div>

            {/* Status */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Status: </span>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  booking.completed
                    ? "bg-teal-100 text-teal-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.completed ? "Completed" : "Not Completed"}
              </span>
            </div>

            {/* Total Amount */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Total Amount: </span>₹
              {booking?.cartItems
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                    .format(
                      booking?.cartItems.reduce(
                        (acc, cur) => acc + cur.price * cur.quantity,
                        18
                      )
                    )
                    .replace("₹", "")
                    .trim()
                : "0.00"}
            </div>

            {/* Action */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Action: </span>
              <Link href={`/admin/bookings/${booking._id}`}>
                <IconButton variant="text" color="blue-gray">
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </IconButton>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
