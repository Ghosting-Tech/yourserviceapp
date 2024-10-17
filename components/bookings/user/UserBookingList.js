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

const UserBookingList = ({ bookings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {bookings?.map((service, index) => {
        return (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
          >
            <div className="bg-gray-300 text-gray-900 py-1 flex justify-center items-center uppercase truncate text-sm">
              {service.status}
            </div>
            <div className="p-4 flex gap-4 flex-col">
              {service.cartItems.map((item, itemIndex) => (
                <div className="flex flex-col gap-2" key={item._id}>
                  <div
                    key={itemIndex}
                    className={`flex items-center space-x-2`}
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
                      <div className="flex items-center justify-between gap-4 mt-1">
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
              href={`/user/bookings/${service._id}`}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium transition-all hover:bg-blue-600 flex items-center gap-2 justify-center"
            >
              View
              <IoMdOpen />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default UserBookingList;
