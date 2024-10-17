import Image from "next/image";
import React, { useState } from "react";
import { Dialog, IconButton, Button } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import { Typography } from "@material-tailwind/react";
import { FaPhone } from "react-icons/fa6";
import { IoMdMailOpen, IoMdOpen } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { Rating } from "@material-tailwind/react";
import { PiGenderIntersexFill } from "react-icons/pi";

const UserCompletedBooking = ({
  userCompletedBookings,
  setSelectedUserCompletedBooking,
  handleOpenUserBookingCompletedDialog,
  openUserBookingCompletedDialog,
  selectedUserCompletedBooking,
}) => {
  const [openServiceProviderDetailDialog, setOpenServiceProviderDetailDialog] =
    useState(false);

  const handleServiceProviderDetailDialog = () =>
    setOpenServiceProviderDetailDialog(!openServiceProviderDetailDialog);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return (
    <div className="px-10 my-10">
      <h2 className="text-2xl text-teal-500 font-semibold">Service History!</h2>
      <div className="h-px bg-gray-300 w-full my-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {userCompletedBookings.map((service, index) => {
          return (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
            >
              <div className="bg-teal-100 text-sm text-teal-500 py-1 flex justify-center items-center uppercase">
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
              <button
                className="px-4 py-2 bg-teal-500 text-white text-sm font-medium transition-all hover:bg-teal-600 flex items-center gap-2 justify-center"
                onClick={() => {
                  setSelectedUserCompletedBooking(service);
                  handleOpenUserBookingCompletedDialog();
                }}
              >
                View <IoMdOpen />
              </button>
            </div>
          );
        })}
        <Dialog
          open={openUserBookingCompletedDialog}
          handler={handleOpenUserBookingCompletedDialog}
          size="xl"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.1, y: 500 },
          }}
        >
          <div
            key={selectedUserCompletedBooking._id}
            className="container overflow-auto bg-white rounded-lg p-6 h-[36rem]"
          >
            <header className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h1 className="text-center text-3xl text-gray-700">
                Booking Details
              </h1>
              <IconButton
                variant="text"
                onClick={handleOpenUserBookingCompletedDialog}
              >
                <RxCross2 size={25} />
              </IconButton>
            </header>
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <section>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {selectedUserCompletedBooking?.cartItems?.map((item) => {
                  return (
                    <div className="flex items-center gap-3" key={item._id}>
                      <Image
                        width={100}
                        height={100}
                        src={item.icon?.url}
                        className="rounded-md w-28 h-28 object-cover"
                        alt="Booking"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="md:text-2xl sm:text-2xl text-xl text-gray-700 ">
                          {item.name}
                        </h3>
                        <p>
                          Price:{" "}
                          <strong className="text-teal-500 font-semibold">
                            ₹{item.price}
                          </strong>
                        </p>
                        <p>
                          Qty:{" "}
                          <strong className="text-gray-600">
                            {item.quantity}
                          </strong>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <h4 className="text-blue-500 font-semibold text-xl mt-4">
                Your Information
              </h4>
              <div className="h-px bg-gray-300 w-full mt-2 mb-1"></div>
              <div className="flex flex-col justify-between gap-4">
                <div>
                  Full Name:{" "}
                  <strong className="text-gray-600">
                    {selectedUserCompletedBooking?.fullname}
                  </strong>
                </div>
                <div>
                  Phone:{" "}
                  <strong className="text-gray-600">
                    +91 {selectedUserCompletedBooking?.phoneNumber}
                  </strong>
                </div>
                <div>
                  Address:{" "}
                  <strong className="text-gray-600">
                    {selectedUserCompletedBooking?.address}
                  </strong>
                </div>
                <div>
                  Booking Date:{" "}
                  <strong className="text-gray-600">
                    {selectedUserCompletedBooking?.date}
                  </strong>
                </div>
                <div className="text-gray-800 font-bold flex items-center gap-2">
                  Status:{" "}
                  <span className="text-teal-500 rounded-md">
                    {selectedUserCompletedBooking?.status}
                  </span>
                </div>
                <div className="text-gray-800 font-bold flex flex-col gap-2">
                  About Service Provider:
                  <div className="flex gap-2 items-center">
                    {selectedUserCompletedBooking?.assignedServiceProviders
                      ?.image?.url ? (
                      <Image
                        src={
                          selectedUserCompletedBooking?.assignedServiceProviders
                            ?.image?.url
                        }
                        className="rounded-full h-12 w-12 object-cover"
                        alt="Booking"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div className="w-12 h-12 text-xl text-black rounded-full flex justify-center items-center font-junge bg-gray-400">
                        {selectedUserCompletedBooking?.assignedServiceProviders
                          ?.name &&
                          Array.from(
                            selectedUserCompletedBooking
                              ?.assignedServiceProviders?.name
                          )[0].toUpperCase()}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div className="text-gray-700 font-semibold text-xl">
                        {
                          selectedUserCompletedBooking?.assignedServiceProviders
                            ?.name
                        }
                      </div>
                      <div className="text-gray-700 text-sm font-medium">
                        {
                          selectedUserCompletedBooking?.assignedServiceProviders
                            ?.phoneNumber
                        }
                      </div>
                    </div>
                    <button
                      onClick={handleServiceProviderDetailDialog}
                      className="flex items-center justify-center rounded-full bg-blue-100 w-10 h-10"
                    >
                      <IoMdOpen size={15} />
                    </button>
                  </div>
                  <Dialog
                    open={openServiceProviderDetailDialog}
                    handler={handleServiceProviderDetailDialog}
                    size="sm"
                    className="p-6"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0.1, y: 500 },
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xl font-semibold text-blue-gray-500">
                        Service provider detail
                      </div>

                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={handleServiceProviderDetailDialog}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </IconButton>
                    </div>
                    <div className="mb-4 flex flex-col   border-b border-blue-gray-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="w-12 h-12 text-xl text-black rounded-full flex justify-center items-center font-junge bg-gray-400">
                            {selectedUserCompletedBooking
                              ?.assignedServiceProviders?.name &&
                              Array.from(
                                selectedUserCompletedBooking
                                  ?.assignedServiceProviders?.name
                              )[0].toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <Typography
                            variant="h5"
                            color="blue"
                            className="font-semibold"
                          >
                            {
                              selectedUserCompletedBooking
                                ?.assignedServiceProviders?.name
                            }
                          </Typography>
                          <div className="text-gray-800 flex items-center gap-2 mx-auto  font-bold">
                            <Rating value={4} readonly /> 4.5
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      color="gray"
                      className="flex flex-col gap-3 items-start pr-4 font-normal"
                    >
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-teal-500" size={23} />
                        Phone: +91{" "}
                        {
                          selectedUserCompletedBooking?.assignedServiceProviders
                            ?.phoneNumber
                        }
                      </div>
                      <div className="flex items-center gap-3">
                        <IoMdMailOpen
                          className="text-deep-purple-500"
                          size={23}
                        />
                        Email:{" "}
                        {
                          selectedUserCompletedBooking?.assignedServiceProviders
                            ?.email
                        }
                      </div>
                      <div className="flex items-center gap-3">
                        <PiGenderIntersexFill
                          className="text-blue-500"
                          size={23}
                        />
                        Gender:{" "}
                        {
                          selectedUserCompletedBooking?.assignedServiceProviders
                            ?.gender
                        }
                      </div>
                      <div className="flex items-center gap-3">
                        <FaBookmark className="text-amber-500" size={23} />
                        Booked Over: 5 times
                      </div>
                    </div>
                  </Dialog>
                </div>
                <div className="h-px bg-gray-300 w-full"></div>
                <div>
                  Day of departure:{" "}
                  <strong className="text-gray-600">
                    {selectedUserCompletedBooking?.date}
                  </strong>
                </div>
                <div>
                  Time of departure:{" "}
                  <strong className="text-gray-600">
                    {selectedUserCompletedBooking?.time}
                  </strong>
                </div>
                <div>
                  Quantity: <strong className="text-gray-600">1</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2 flex-col">
                    <div className="text-gray-800 font-bold flex gap-2 items-center">
                      Verification OTP:{" "}
                      <span className="flex items-center gap-2">
                        {selectedUserCompletedBooking.otp
                          .split("")
                          .map((code, index) => {
                            return (
                              <span
                                key={index}
                                className="w-10 h-10 flex items-center justify-center text-lg rounded-md bg-gray-700 text-white"
                              >
                                {code}
                              </span>
                            );
                          })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Verification code is used to verify the service provider
                      when they reached to you!
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="my-4">
              <table className="min-w-full  ">
                <thead>
                  <tr>
                    <th className="text-left text-2xl text-gray-700 font-normal">
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Subtotal</td>
                    <td className="py-2 px-4 border-b text-right">
                      ₹
                      {selectedUserCompletedBooking?.cartItems
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                            .format(
                              selectedUserCompletedBooking?.cartItems.reduce(
                                (acc, cur) => acc + cur.price * cur.quantity,
                                0
                              )
                            )
                            .replace("₹", "")
                            .trim()
                        : "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Convenience Fee</td>
                    <td className="py-2 px-4 border-b text-right">₹18.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-bold">Total</td>
                    <td className="py-2 px-4 text-right font-bold">
                      ₹
                      {selectedUserCompletedBooking?.cartItems
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                            .format(
                              selectedUserCompletedBooking?.cartItems.reduce(
                                (acc, cur) => acc + cur.price * cur.quantity,
                                18
                              )
                            )
                            .replace("₹", "")
                            .trim()
                        : "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="flex justify-end items-center">
              <Button
                variant="gradient"
                color="blue"
                className="rounded"
                onClick={handleOpenUserBookingCompletedDialog}
              >
                Close Dialog
              </Button>
            </section>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default UserCompletedBooking;
