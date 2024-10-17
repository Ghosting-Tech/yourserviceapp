import { Button } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UpdateServiceStatus = ({ selectedNewBooking, setSelectedNewBooking }) => {
  const [completeOtp, setCompleteOtp] = useState(["", "", "", ""]);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleChangeCompleteOtp = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...completeOtp];
    newOtp[index] = element.value;
    setCompleteOtp(newOtp);

    // Move to the next input box if the current one is filled
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDownCompleteOtp = (e, index) => {
    if (e.key === "Backspace") {
      if (!completeOtp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
  }

  const handleGeneratingCompleteOtp = async () => {
    const authkey = process.env.NEXT_PUBLIC_AUTH_KEY;
    const company = "service wallah";
    const name = selectedNewBooking.fullname;
    const mobile = selectedNewBooking.phoneNumber;
    const country_code = "+91";
    const SID = "13608";
    const otp = generateOTP();

    const url = `https://api.authkey.io/request?authkey=${authkey}&mobile=${mobile}&country_code=${country_code}&sid=${SID}&company=${company}&otp=${otp}`;
    await axios.get(url);

    const updatedBooking = {
      ...selectedNewBooking,
      serviceCompletedOtp: otp,
    };
    setSelectedNewBooking(updatedBooking);

    await axios.put(`/api/bookings/${selectedNewBooking._id}`, updatedBooking);
    toast.success("OTP sent successfully!");
    // Disable the OTP button and start the timer
    setIsOtpButtonDisabled(true);
    setTimer(30);
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsOtpButtonDisabled(false);
    }
  }, [timer]);

  const handleUpdateServiceStatusByServiceProvider = async () => {
    try {
      if (completeOtp.join("") !== selectedNewBooking.serviceCompletedOtp) {
        toast.error("Invalid OTP!");
        return;
      }

      const updatedStatusBooking = {
        ...selectedNewBooking,
        status: "Service is Completed",
        invoices: {
          ...selectedNewBooking.invoices,
          status: "Service is Completed!",
        },
        completed: true,
        invoices: { ...selectedNewBooking.invoices, paid: true },
      };

      setSelectedNewBooking(updatedStatusBooking);

      const res = await axios.put(
        `/api/bookings/${selectedNewBooking._id}`,
        updatedStatusBooking
      );

      if (res.status !== 201) {
        toast.error("Failed to update the status!");
        return;
      }

      const total_amount = (
        selectedNewBooking.cartItems.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        ) +
        (18 + Number(selectedNewBooking.invoices.total))
      ).toFixed(2);

      // Percentage for the amount
      const percentage = 80;

      // Calculate the amount based on the percentage
      const amount = (total_amount * (percentage / 100)).toFixed(2);

      // Send payment request with the calculated amount
      const paymentResponse = await axios.post(`/api/payment`, {
        service_provider: selectedNewBooking.assignedServiceProviders._id,
        bookingId: selectedNewBooking._id,
        total_amount,
        amount,
        booking: selectedNewBooking._id,
      });
      if (!paymentResponse.data.success) {
        toast.error(paymentResponse.data.message);
        return;
      }
      toast.success(paymentResponse.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {selectedNewBooking.completed ? (
        <div className="text-lg py-4 md:py-8 lg:py-0 bg-white shadow-lg w-full flex justify-center items-center h-full rounded-lg text-teal-500">
          Service is completed!
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-4">
          <div className="md:text-xl sm:text-xl text-lg text-gray-500 font-normal flex justify-center gap-2">
            Complete the Service
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <div className="flex items-center justify-center gap-4">
              {completeOtp.map((data, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={data}
                    onChange={(e) => handleChangeCompleteOtp(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDownCompleteOtp(e, index)}
                  />
                );
              })}
            </div>
            <Button
              size="sm"
              variant="text"
              color="blue-gray"
              className="underline"
              onClick={handleGeneratingCompleteOtp}
              disabled={isOtpButtonDisabled}
            >
              {isOtpButtonDisabled ? `Resend OTP in ${timer} s` : "Send OTP"}
            </Button>
          </div>

          <Button
            color="blue"
            variant="gradient"
            onClick={handleUpdateServiceStatusByServiceProvider}
          >
            Service Completed
          </Button>
        </div>
      )}
    </>
  );
};

export default UpdateServiceStatus;
