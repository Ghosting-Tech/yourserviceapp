import { storage } from "@/firebase";
import { Button, Dialog, Input } from "@material-tailwind/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";

const VerifyOtp = ({
  open,
  setOpen,
  generatedOTP,
  inputData,
  setInputData,
  SendingOtp,
  isOtpButtonDisabled,
  setIsOtpButtonDisabled,
  timer,
  setTimer,
  handleOpenResponseDialog,
}) => {
  const handleOpen = () => setOpen(!open);
  const [uploadingLoading, setUploadingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsOtpButtonDisabled(false);
    }
    //eslint-disable-next-line
  }, [timer]);
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleRegisterServiceProvider = async (e) => {
    e.preventDefault();
    if (otp === undefined || otp !== generatedOTP) {
      toast.error("Invalid OTP");
      return;
    }
    setUploadingLoading(true);

    // Upload Profile Image
    const profileImageRef = ref(
      storage,
      `service-provider/id/${
        inputData.image.lastModified +
        inputData.image.size +
        inputData.image.name
      }`
    );
    await uploadBytes(profileImageRef, inputData.image);
    const profileImageUrl = await getDownloadURL(profileImageRef);

    // Upload Id1 Image
    const id1ImageRef = ref(
      storage,
      `service-provider/id/${
        inputData.id1.image.file.lastModified +
        inputData.id1.image.file.size +
        inputData.id1.image.file.name
      }`
    );
    await uploadBytes(id1ImageRef, inputData.id1.image.file);
    const id1ImageUrl = await getDownloadURL(id1ImageRef);

    // Upload Id2 Image
    const id2ImageRef = ref(
      storage,
      `service-provider/id/${
        inputData.id2.image.file.lastModified +
        inputData.id2.image.file.size +
        inputData.id2.image.file.name
      }`
    );
    await uploadBytes(id2ImageRef, inputData.id2.image.file);
    const id2ImageUrl = await getDownloadURL(id2ImageRef);

    const postData = {
      ...inputData,
      image: {
        url: profileImageUrl,
        name: profileImageRef._location.path_,
      },
      id1: {
        name: inputData.id1.name,
        image: {
          url: id1ImageUrl,
          name: id1ImageRef._location.path_,
        },
      },
      id2: {
        name: inputData.id2.name,
        image: {
          url: id2ImageUrl,
          name: id2ImageRef._location.path_,
        },
      },
    };
    try {
      await fetch("/api/service-providers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      handleOpenResponseDialog(true);
      setInputData({
        name: "",
        phoneNumber: "",
        email: "",
        image: {
          url: "",
          name: "",
        },
        id1: {
          name: "",
          image: {
            url: "",
            name: "",
          },
        },
        id2: {
          name: "",
          image: {
            url: "",
            name: "",
          },
        },
        gender: "",
        aadhar: "",
        city: "",
        password: "",
        role: "service-provider",
        active: false,
        image: null,
      });
      setUploadingLoading(false);
    } catch (error) {
      handleOpenResponseDialog(true);
      console.log("Something went wroung while regestering.", error);
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      dismiss={{ enabled: false }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
          Verify OTP
        </h2>
        <form
          onSubmit={handleRegisterServiceProvider}
          className="flex flex-col gap-4"
        >
          <Input
            label="Enter OTP"
            maxLength={4}
            color="blue"
            value={otp}
            size="lg"
            minLength={4}
            onChange={handleChange}
          />

          <p className="text-gray-600 flex gap-1 text-xs items-center">
            <FaInfoCircle />
            <span>
              Please enter the 4-digit OTP sent to your mobile number{" "}
              {inputData.phoneNumber}.
            </span>
          </p>

          <div className="flex gap-4 items-center">
            <Button
              variant="text"
              color="blue-gray"
              className="underline w-full"
              onClick={SendingOtp}
              disabled={isOtpButtonDisabled}
            >
              {isOtpButtonDisabled ? `Resend OTP in ${timer} s` : "Send OTP"}
            </Button>
            <Button
              type="submit"
              color="blue"
              fullWidth
              className="flex justify-center"
              loading={uploadingLoading}
            >
              Verify OTP
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default VerifyOtp;
