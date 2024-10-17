import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoMdOpen } from "react-icons/io";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const color = {
  Cancelled: "bg-red-400 text-white",
  "Service is not started": "bg-orange-400 text-white",
  "Service is Completed": "bg-green-400 text-white",
};

const ServiceProviderBookingList = ({ booking }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {booking.map((service, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
        >
          <div
            className={`${
              color[service.status] || "bg-gray-300 text-gray-900"
            } py-1 flex justify-center items-center text-xs uppercase truncate`}
          >
            {service.status}
          </div>
          <div className="p-4 flex gap-4 flex-col">
            {service.cartItems.map((item, itemIndex) => (
              <div className="flex flex-col gap-2" key={item._id}>
                <div
                  key={itemIndex}
                  className={`flex items-center space-x-2 pb-4 `}
                >
                  <div className="flex-shrink-0">
                    <Image
                      width={100}
                      height={100}
                      className="w-16 h-16 rounded-full object-cover"
                      src={item.icon?.url}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs">
                      {new Date(service?.createdAt).toLocaleDateString(
                        "en-US",
                        options
                      )}
                    </p>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-black"> Id:</span>{" "}
                      {service.bookingId}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-lg font-bold text-teal-600">
                        ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
                {itemIndex < service.cartItems.length - 1 ? (
                  <div className="h-px bg-gray-300 w-full"></div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
          <Link
            href={`/service-provider/booking/${service._id}`}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium transition-all hover:bg-blue-600 flex items-center gap-1 justify-center"
          >
            View
            <IoMdOpen />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ServiceProviderBookingList;
