import React from "react";
import {
  Typography,
  Button,
  IconButton,
  Dialog,
} from "@material-tailwind/react";
import {
  CardBody,
  Input,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import {
  AiFillQuestionCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { useState } from "react";
import {
  IoPersonCircleOutline,
  IoSendSharp,
  IoShieldCheckmark,
} from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { RiLoginCircleFill } from "react-icons/ri";
import { toast } from "sonner";
import UserNavigation from "./UserNavigation";
import { setUser } from "@/redux/slice/userSlice";
import { useDispatch } from "react-redux";

const Profile = ({
  openLoginDialog,
  setOpenLoginDialog,
  handleOpenLoginDialog,
}) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginData.phoneNumber || !loginData.password) {
      toast.error("Invalid data");
      return;
    }
    if (loginData.phoneNumber.length != 10) {
      toast.error("Invalid Phone number");
      return;
    }
    try {
      const response = await fetch(
        "/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        },
        { cache: "no-store" }
      );
      const data = await response.json();
      if (response.status == 200) {
        dispatch(setUser(data.user));
        setOpenLoginDialog(false);
        setLoginData({
          phoneNumber: "",
          password: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(
        `Something went wrong while logging ${loginData.phoneNumber}`
      );
    }
  }

  // Registration
  const [open4, setOpen4] = useState(false);
  const handleOpen4 = () => setOpen4(!open4);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };
  function generateOTP() {
    // Generate a random number between 1000 and 9999
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
  }
  const [generatedOTP, setGeneratedOtp] = useState();
  const [type, setType] = useState("card");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setRegisterData({
      ...registerData,
      email,
    });

    // Simple email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Check if the entered email matches the pattern
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError(""); // Clear the error if the email is valid
    }
  };
  const verifyingRegisterOtp = async () => {
    if (
      !registerData.name ||
      !registerData.phoneNumber ||
      !registerData.password ||
      !registerData.email
    ) {
      toast.error("Invalid data");
      return;
    }

    if (registerData.phoneNumber.length != 10) {
      toast.error("Invalid Phone number");
      return;
    }
    if (emailError) {
      return toast.error("Please enter valid email address");
    }
    const response = await axios.post(`/api/users/checking`, registerData);
    const data = await response.data;
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    const authkey = process.env.NEXT_PUBLIC_AUTH_KEY;
    const name = "service wallah account";
    const mobile = registerData.phoneNumber;
    const country_code = "+91";
    const SID = "13608";
    const otp = generateOTP();
    setGeneratedOtp(otp);
    const url = `https://api.authkey.io/request?authkey=${authkey}&mobile=${mobile}&country_code=${country_code}&sid=${SID}&company=${name}&otp=${otp}`;
    await axios.get(url);
    setOpen4(true);
  };
  async function handleRegister(e) {
    e.preventDefault();
    if (
      !registerData.name ||
      !registerData.phoneNumber ||
      !registerData.password
    ) {
      toast.error("Invalid data");
      return;
    }

    try {
      if (otp === undefined || otp !== generatedOTP) {
        toast.error("Invalid OTP");
        return;
      }
      await axios.post(`/api/users/register`, registerData);
      const loginResponse = await fetch(
        "/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: registerData.phoneNumber,
            password: registerData.password,
          }),
        },
        { cache: "no-store" }
      );
      const data = await loginResponse.json();

      if (loginResponse.status == 200) {
        dispatch(setUser(data.user));
        setOpen4(false);
        setOpenLoginDialog(false);
        setOtp("");
        setRegisterData({
          name: "",
          phoneNumber: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(`Something went wrong while Registering`);
    }
  }

  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const handleOpenForgotPassword = () =>
    setOpenForgotPassword(!openForgotPassword);

  const [forgotPasswordGeneratedOTP, setForgotPasswordGeneratedOtp] =
    useState(0);
  const [forgetPasswordNumber, setForgetPasswordNumber] = useState("");
  const [otpSended, setOtpSended] = useState(false);
  const [forgotPasswordOtpVerified, setForgotPasswordOtpVerified] =
    useState(false);

  const handleThrowingOtp = async () => {
    if (forgetPasswordNumber.length != 10) return;
    const authkey = process.env.NEXT_PUBLIC_AUTH_KEY;
    const name = "service wallah account";
    const mobile = forgetPasswordNumber;
    const country_code = "+91";
    const SID = "13608";
    const otp = generateOTP();
    setForgotPasswordGeneratedOtp(otp);
    const url = `https://api.authkey.io/request?authkey=${authkey}&mobile=${mobile}&country_code=${country_code}&sid=${SID}&company=${name}&otp=${otp}`;
    await axios.get(url);
    setOtpSended(true);
  };
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [updatedPasswordError, setUpdatedPasswordError] = useState(false);
  const verifyingOtp = async (otp) => {
    if (otp === forgotPasswordGeneratedOTP) {
      setForgotPasswordOtpVerified(true);
    }
  };
  const handleUpdatePassword = async () => {
    try {
      const response = await axios.put("/api/users/update", {
        password: updatedPassword,
        phoneNumber: forgetPasswordNumber,
      });

      if (response.status === 201) {
        setOpenForgotPassword(false);
        setLoginData({ ...loginData, phoneNumber: forgetPasswordNumber });
        setForgotPasswordGeneratedOtp(0);
        setForgotPasswordOtpVerified(false);
        setOtpSended(false);
        setUpdatedPassword("");
        setUpdatedPasswordError(false);
      } else {
        throw new Error("Failed to update password");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <UserNavigation handleOpenLoginDialog={handleOpenLoginDialog} />

      <Dialog
        open={openLoginDialog}
        handler={handleOpenLoginDialog}
        size="sm"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <CardBody>
          <Tabs value={type} className="">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-md text-center flex gap-1 items-center font-julius font-bold text-gray-700">
                <IoPersonCircleOutline size={24} /> Login | Register
              </h1>
              <IconButton
                variant="text"
                onClick={handleOpenLoginDialog}
                className="cursor-pointer"
              >
                <RxCross1 size={20} />
              </IconButton>
            </div>

            <TabsHeader className="relative z-0 ">
              <Tab
                value="card"
                onClick={() => {
                  setType("card");
                  setShowPassword(false);
                }}
              >
                LogIn
              </Tab>
              <Tab
                value="paypal"
                onClick={() => {
                  setType("paypal");
                  setShowPassword(false);
                }}
              >
                Register Now
              </Tab>
            </TabsHeader>
            <TabsBody
              className="!overflow-x-hidden"
              animate={{
                initial: {
                  x: type === "card" ? 400 : -400,
                },
                mount: {
                  x: 0,
                },
                unmount: {
                  x: type === "card" ? 400 : -400,
                },
              }}
            >
              <TabPanel value="card" className="p-0">
                <form
                  className="flex flex-col gap-4 mt-5 justify-center"
                  onSubmit={handleLogin}
                >
                  <div className="w-full ">
                    <Input
                      type="tel"
                      label="Phone Number"
                      minLength={10}
                      maxLength={10}
                      value={loginData.phoneNumber}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
                      }}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-full relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                    />
                    <div
                      className="absolute right-5 top-2.5 p-0 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <AiOutlineEye size={20} color="gray" />
                      ) : (
                        <AiOutlineEyeInvisible size={20} color="gray" />
                      )}
                    </div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="mt-2 flex flex-col justify-center gap-1 font-normal"
                    >
                      <span className="flex gap-1 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="-mt-px h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Password should be more than 10 characters long
                        including letters and numbers
                      </span>
                    </Typography>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      fullWidth
                      size="md"
                      variant="outlined"
                      color="blue-gray"
                      onClick={handleOpenForgotPassword}
                    >
                      Forgot Password?
                    </Button>
                    <Dialog
                      size="xs"
                      className="p-6 h-60 overflow-hidden"
                      dismiss={{ enabled: false }}
                      handler={handleOpenForgotPassword}
                      open={openForgotPassword}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h1 className="text-md text-center flex gap-1 items-center text-blue-800">
                          Forgot password
                          <AiFillQuestionCircle size={20} />
                        </h1>
                        <IconButton
                          variant="text"
                          onClick={handleOpenForgotPassword}
                          className="cursor-pointer"
                        >
                          <RxCross1 size={20} />
                        </IconButton>
                      </div>
                      <div className="relative">
                        <div
                          className={`w-full flex flex-col gap-2 transition-all duration-500 absolute ${
                            forgotPasswordOtpVerified
                              ? "-translate-x-[40rem]"
                              : "-translate-x-0"
                          }`}
                        >
                          <Input
                            onChange={(e) =>
                              setForgetPasswordNumber(e.target.value)
                            }
                            label="Enter Your Phone Number"
                            required
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              ); // Only allows digits
                            }}
                            minLength={10}
                            maxLength={10}
                          />
                          <Input
                            label="Enter OTP"
                            required
                            disabled={!otpSended}
                            minLength={4}
                            maxLength={4}
                            onChange={(e) => verifyingOtp(e.target.value)}
                          />
                          <Button
                            onClick={handleThrowingOtp}
                            variant="gradient"
                            disabled={otpSended}
                            color="blue"
                            className="flex gap-2 items-center justify-center"
                            fullWidth
                          >
                            Send OTP <IoSendSharp />
                          </Button>
                        </div>
                        <div
                          className={`flex flex-col items-center gap-2 transition-all duration-500 w-full absolute ${
                            forgotPasswordOtpVerified
                              ? "translate-x-0"
                              : "translate-x-[45rem]"
                          }`}
                        >
                          <Input
                            label="Enter New Password"
                            minLength={10}
                            type="password"
                            maxLength={25}
                            required
                            color="blue"
                            onChange={(e) => setUpdatedPassword(e.target.value)}
                          />
                          <Input
                            label="Enter Password again"
                            minLength={10}
                            type="password"
                            maxLength={25}
                            required
                            color="blue"
                            error={updatedPasswordError}
                            onChange={(e) => {
                              if (e.target.value !== updatedPassword) {
                                setUpdatedPasswordError(true);
                              } else {
                                setUpdatedPasswordError(false);
                              }
                            }}
                          />
                          <Button
                            onClick={handleUpdatePassword}
                            variant="gradient"
                            disabled={updatedPasswordError}
                            color="blue"
                            className="flex gap-2 items-center justify-center"
                            fullWidth
                          >
                            Update Password
                            <IoIosCheckmarkCircle size={20} />
                          </Button>
                        </div>
                      </div>
                    </Dialog>
                    <Button
                      fullWidth
                      size="md"
                      type="submit"
                      variant="gradient"
                      color="blue"
                      className="flex gap-1 items-center justify-center"
                    >
                      Login <RiLoginCircleFill size={20} />
                    </Button>
                  </div>
                </form>
              </TabPanel>
              <TabPanel value="paypal" className="p-0">
                <div className="mt-5 flex flex-col gap-4 ">
                  <div className="w-full">
                    <Input
                      label="Fullname"
                      value={registerData.name}
                      minLength={4}
                      maxLength={30}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        ); // Only allows letters and spaces
                      }}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      type="tel"
                      label="Phone Number"
                      minLength={10}
                      maxLength={10}
                      value={registerData.phoneNumber}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
                      }}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="relative flex w-full max-w-full">
                    <Input
                      type="email"
                      label="Email Address"
                      required
                      value={registerData.email}
                      onChange={handleEmailChange}
                      className="pr-20"
                      containerProps={{
                        className: "min-w-0",
                      }}
                    />
                  </div>
                  <div className="w-full relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      required
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                    />
                    <div
                      className="absolute right-5 top-2.5 p-0 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <AiOutlineEye size={20} color="gray" />
                      ) : (
                        <AiOutlineEyeInvisible size={20} color="gray" />
                      )}
                    </div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="mt-2 flex flex-col justify-center gap-1 font-normal"
                    >
                      <span className="flex gap-1 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="-mt-px h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Password should be more than 10 characters long
                        including letters and numbers
                      </span>
                    </Typography>
                  </div>

                  <Button
                    onClick={verifyingRegisterOtp}
                    variant="gradient"
                    fullWidth
                    size="lg"
                    color="blue"
                    className="flex gap-1 items-center justify-center"
                  >
                    Verify Number <IoShieldCheckmark size={20} />
                  </Button>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Dialog>
      <Dialog
        open={open4}
        handler={handleOpen4}
        size="xs"
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
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
              <FaInfoCircle />{" "}
              <span>
                Please enter the 4-digit OTP sent to your mobile number{" "}
                {registerData.phoneNumber}.
              </span>
            </p>

            <button
              type="submit"
              className="w-full bg-blue-400 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default Profile;
