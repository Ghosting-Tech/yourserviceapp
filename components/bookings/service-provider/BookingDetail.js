import { storage } from "@/firebase";
import { Button } from "@material-tailwind/react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import axios from "axios";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineCloudUpload } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import UpdateServiceStatus from "./UpdateServiceStatus";
import Invoice from "./Invoice";
import { useRouter } from "next/navigation";
import UserDetail from "@/components/admin/bookings/single-booking/UserDetail";
import LocationDetails from "@/components/admin/bookings/single-booking/LocationDetails";
import BookingHeader from "@/components/admin/bookings/single-booking/BookingHeader";
import ServiceDetails from "@/components/admin/bookings/single-booking/ServiceDetails";
import InvoiceDetail from "@/components/admin/bookings/single-booking/InvoiceDetail";
import { toast } from "sonner";
import { AiOutlineLoading } from "react-icons/ai";

const BookingDetail = ({ booking, setBooking }) => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChangeOtp = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to the next input box if the current one is filled
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDownOtp = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const [otpVerified, setOtpVerified] = useState(false);
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue != booking.otp) {
      toast.error("Invalid otp");
      return;
    }
    setOtpVerified(true);
    setOtp(["", "", "", ""]);
    const postData = {
      ...booking,
      otpVerified: true,
      status: "Service provider has been reached!",
    };

    setBooking(postData);
    const res = await axios.put(`/api/bookings/${booking._id}`, postData);
  };

  const [uploadedImage, setUploadedImage] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const handleImageUpload = async (e) => {
    setImageUploadLoading(true);
    const file = e.target.files[0];
    if (!file) {
      setImageUploadLoading(false);
      return;
    }
    try {
      if (booking?.verificationImage?.url) {
        try {
          await deleteObject(ref(storage, booking?.verificationImage?.name));
        } catch (err) {
          toast.error("Failed to delete the previous image");
        }
      }
      const imageRef = ref(
        storage,
        `service-provider-verification-image/${
          file.lastModified + file.size + file.name
        }`
      );
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef); // Get the image URL directly
      setUploadedImage(imageUrl);
      const imageObject = { url: imageUrl, name: imageRef._location.path_ };
      const postData = {
        ...booking,
        verificationImage: imageObject,
      };
      await axios.put(`/api/bookings/${booking._id}`, postData);
    } catch (err) {
      toast.error("Failed to upload the image");
      console.log(err);
    } finally {
      setImageUploadLoading(false);
    }
  };
  useEffect(() => {
    if (booking?.otpVerified === true) {
      setOtpVerified(true);
    }
    if (booking?.otpVerified !== true) {
      setOtpVerified(false);
    }
    if (booking?.verificationImage?.url) {
      setUploadedImage(booking?.verificationImage?.url);
    }
  }, [booking]);

  const handleRejectRequest = async (id) => {
    try {
      // Filter out the rejected booking from user's bookings
      const filteredBookings = user.bookings?.filter(
        (bookingId) => bookingId !== id
      );
      const updateServiceProviderData = {
        ...user,
        bookings: filteredBookings,
      };

      // Update the user data to remove the rejected booking
      const existingServiceProviderResponse = await axios.post(
        `/api/users/update`,
        updateServiceProviderData
      );
      // Get the current booking data
      const selectedBookingResponse = await axios.get(`/api/bookings/${id}`);
      const newBooking = selectedBookingResponse.data.booking;

      // Filter out the current service provider from available service providers
      const filteredAvailableServiceProviders =
        newBooking.availableServiceProviders.filter(
          (sp) => sp._id !== user._id
        );

      // Update booking data to remove the current service provider
      const bookingData = {
        ...newBooking,
        availableServiceProviders: filteredAvailableServiceProviders,
      };

      // If there's no next service provider available
      if (filteredAvailableServiceProviders.length === 0) {
        const updateNoServiceProviderAvailableData = {
          ...bookingData,
          noServiceProviderAvailable: true,
        };

        // Mark booking as no service provider available
        const updateBookingResponse = await axios.put(
          `/api/bookings/${id}`,
          updateNoServiceProviderAvailableData
        );
        router.push(`/service-provider/booking?page=1`);
        return;
      }
      router.push(`/service-provider/booking?page=1`);
    } catch (err) {
      console.log("Error occurred:", err);
    }
  };

  const handleAcceptRequest = async (id) => {
    const eliminateServiceProviders = booking.availableServiceProviders.filter(
      (serviceProvider) => {
        return serviceProvider._id !== user._id;
      }
    );
    try {
      const res = await axios.post(
        `/api/bookings/eliminate-service-providers`,
        {
          eliminateServiceProviders,
          bookingId: id,
          serviceProvider: user,
        }
      );
      const response = res.data;

      console.log(response);

      if (!response.success) {
        toast.error(response.message);
        if (response.acceptedByAnotherServiceProvider) {
          router.push(`/service-provider/booking?page=1`);
          return;
        }
        return;
      }
      setBooking(response.booking);
      toast.success("Successfully accepted service!");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="px-8 py-2">
      <div className="mb-4">
        <BookingHeader booking={booking} />
        <ServiceDetails booking={booking} />
        <InvoiceDetail booking={booking} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Booking Information
            </h3>
            <div className="flex justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">Booking Date</p>
                <p className="text-lg font-semibold text-gray-700">
                  {booking.date}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking Time</p>
                <p className="text-lg font-semibold text-gray-700">
                  {booking.time}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow w-full">
            <h3 className="text-md md:text-xl font-semibold mb-4 text-gray-800">
              Customer Details
            </h3>
            <UserDetail
              name={booking.fullname}
              profileImage={booking.profileImage}
              email={booking.email}
              phoneNumber={booking.phoneNumber}
            />
          </div>
        </div>
      </div>
      <LocationDetails booking={booking} />
      {booking?.acceptedByServiceProvider && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {otpVerified ? (
            <div className="bg-white rounded-lg shadow-md w-full min-h-44 p-4 flex items-center flex-col justify-center">
              <div className="text-2xl font-julius text-teal-500 font-bold flex flex-col items-center gap-1">
                <RiVerifiedBadgeFill size={75} /> OTP Verified
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md w-full min-h-44 p-4 flex items-center flex-col justify-center">
              <h2 className="md:text-xl sm:text-xl text-lg text-gray-500 font-normal">
                Enter reached verification OTP
              </h2>

              <div className="w-full px-6 flex items-center flex-col md:flex-row justify-center gap-4 mt-4">
                <div className="flex items-center justify-center gap-4">
                  {otp.map((data, index) => {
                    return (
                      <input
                        key={index}
                        type="text"
                        name="otp"
                        maxLength="1"
                        className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                        value={data}
                        onChange={(e) => handleChangeOtp(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleKeyDownOtp(e, index)}
                      />
                    );
                  })}
                </div>
                <button
                  variant="gradient"
                  color="teal"
                  className="rounded px-4 py-2 flex items-center gap-1 bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-100 transition-all font-semibold"
                  onClick={handleVerifyOtp}
                >
                  Verify <FaCheckCircle />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white flex justify-center items-center rounded-lg shadow-md w-full min-h-44 p-4">
            <div className="flex gap-4 flex-col md:flex-row items-center justify-center">
              {imageUploadLoading ? (
                <div className="w-32 rounded-lg object-cover aspect-square bg-gray-300 flex justify-center items-center">
                  <AiOutlineLoading size={32} className="animate-spin" />
                </div>
              ) : (
                <Image
                  width={500}
                  height={500}
                  src={uploadedImage || "https://placehold.co/400"}
                  alt="Uploaded"
                  className="w-32 rounded-lg object-cover aspect-square"
                />
              )}

              <div className="flex flex-col items-center md:items-start justify-center gap-2">
                <h2 className="md:text-xl sm:text-xl text-md text-gray-500 font-normal">
                  Upload verification image
                </h2>
                <label
                  htmlFor="verification-image"
                  className="flex items-center gap-1 w-fit cursor-pointer text-sm bg-blue-500 text-white px-4 py-2 rounded uppercase font-semibold hover:shadow-lg hover:shadow-blue-100 transition-all"
                >
                  Upload Image <MdOutlineCloudUpload />
                </label>
                <input
                  id="verification-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
          {booking.otpVerified && (
            <Invoice
              selectedBooking={booking}
              setSelectedBooking={setBooking}
            />
          )}

          {booking.otpVerified && (
            <UpdateServiceStatus
              selectedNewBooking={booking}
              setSelectedNewBooking={setBooking}
            />
          )}
        </div>
      )}

      <section className="mb-8 mt-4">
        <h3 className="text-xl font-bold text-red-600">Caution:</h3>
        <ol className="list-decimal ml-6 mt-2 text-gray-700">
          <li>Accept the booking as soon as possible.</li>
          <li>Rejection cannot be undone later.</li>
          <li>Verify OTP from the customer.</li>
          <li>Attach an image of doing servicing</li>
          <li>Update the status of service According to you!</li>
          <li>
            Generate an invoice after reviewing the customer problem with the
            necessary details.
          </li>
        </ol>
      </section>
      {!booking?.acceptedByServiceProvider && (
        <div className="my-4 flex justify-end">
          <div className="flex gap-2 w-full md:w-fit">
            <Button
              variant="outlined"
              color="teal"
              ripple
              className="w-full md:w-fit md:px-10 rounded"
              onClick={() => {
                handleRejectRequest(booking?._id);
              }}
            >
              Reject
            </Button>
            <Button
              variant="gradient"
              color="teal"
              ripple
              className="w-full md:w-fit md:px-10 rounded"
              onClick={() => {
                handleAcceptRequest(booking?._id);
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
