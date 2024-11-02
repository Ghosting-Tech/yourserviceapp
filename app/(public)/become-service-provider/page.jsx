"use client";
import { storage } from "@/firebase";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import location from "../../../state&city/location.json";
const CreateServiceProvider = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [inputData, setInputData] = useState({
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
    city: "",
    state: "",
    password: "",
    role: "service-provider",
    active: false,
    image: null,
  });
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  useEffect(() => {
    // Update cities whenever the selected state changes
    if (selectedState) {
      setCities(location[selectedState]);
      setInputData((prevData) => ({
        ...prevData,
        city: "", // Reset city when state changes
      }));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleId1ProofChange = (e) => {
    const selectedProof = e;
    setInputData((prevData) => ({
      ...prevData,
      id1: {
        ...prevData.id1,
        name: selectedProof,
      },
    }));
  };
  const handleId2ProofChange = (e) => {
    const selectedProof = e;
    setInputData((prevData) => ({
      ...prevData,
      id2: {
        ...prevData.id2,
        name: selectedProof,
      },
    }));
  };
  const handleid1Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData((prevData) => ({
        ...prevData,
        id1: {
          ...prevData.id1,
          image: {
            file,
          },
        },
      }));
    }
  };
  const handleid2Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData((prevData) => ({
        ...prevData,
        id2: {
          ...prevData.id2,
          image: {
            file,
          },
        },
      }));
    }
  };

  const handleStateChange = (e) => {
    const state = e; // Check if e.target exists; if not, use e directly
    setSelectedState(state);
    setInputData((prevData) => ({
      ...prevData,
      state: state,
    }));
  };

  const handleCityChange = (e) => {
    const city = e;
    setInputData((prevData) => ({
      ...prevData,
      city: city,
    }));
  };
  const validateInputs = () => {
    console.log({ data: inputData });
    let isValid = true; // Track the validity of inputs

    // Validate name
    if (!inputData.name) {
      toast.error("All fields are required");
      isValid = false;
      return;
    }

    // Validate image
    if (!inputData.image) {
      toast.error("please upload the profile image");
      isValid = false;
      return;
    }
    if (inputData.image.size >= 1000000) {
      toast.error("Please upload the profile image less than 1Mb");
      isValid = false;
      return;
    }
    if (!inputData.id1.name) {
      toast.error("Please select the first Id");
      isValid = false;
      return;
    }
    if (!inputData.id2.name) {
      toast.error("Please select the second Id");
      isValid = false;
      return;
    }
    if (inputData.id1.image.name === "") {
      toast.error("Please upload the first id image");
      isValid = false;
      return;
    }
    if (inputData.id2.image.name === "") {
      toast.error("Please upload the second id image");
      isValid = false;
      return;
    }
    if (inputData.id1.image.file.size >= 1000000) {
      toast.error("Please upload the first id  image less than 1Mb");
      isValid = false;
      return;
    }
    if (inputData.id2.image.file.size >= 1000000) {
      toast.error("Please upload the second id image less than 1Mb");
      isValid = false;
      return;
    }

    // Validate state
    if (!inputData.state) {
      toast.error("All fields are required");
      isValid = false;
      return;
    }
    // Validate phone number
    if (!inputData.phoneNumber) {
      toast.error("All fields are required");
      isValid = false;
      return;
    } else if (inputData.phoneNumber.length !== 10) {
      toast.error("Invalid Phone number");
      isValid = false;
      return;
    }

    // Validate email
    if (!inputData.email) {
      toast.error("All fields are required");
      isValid = false;
      return;
    } else if (!/\S+@\S+\.\S+/.test(inputData.email)) {
      toast.error("Invalid email address");
      isValid = false;
      return;
    }

    // Validate gender
    if (!inputData.gender) {
      toast.error("All fields are required");
      isValid = false;
      return;
    }

    // Validate city
    if (!inputData.city) {
      toast.error("All fields are required");
      isValid = false;
      return;
    }
    if (!inputData.state) {
      toast.error("All fields are required");
      isValid = false;
      return;
    }

    // Validate password
    if (!inputData.password) {
      toast.error("All fields are required");
      isValid = false;
      return;
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{10,}$/.test(
        inputData.password
      )
    ) {
      toast.error(
        "Invalid Password: Minimum 10 characters, at least 1 letter and 1 number"
      );
      isValid = false;
      return;
    }

    return isValid; // Return whether all inputs are valid
  };

  const [open, setOpen] = useState(false);
  const [popError, setPopError] = useState("");

  const handleOpen = () => setOpen(!open);
  const [uploadingLoading, setUploadingLoading] = useState(false);
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
  const SendingOtp = async () => {
    console.log({ Data: inputData });

    const isValid = validateInputs(); // Check validation

    // Stop execution if validation failed
    if (!isValid) return;

    // Checking if phone number or email exists

    const data = await axios.post(`/api/users/checking`, {
      phoneNumber: inputData.phoneNumber,
      email: inputData.email,
    });
    const user = await data.data;

    if (!user.success) {
      toast.error(user.message);
      return;
    }

    // Continue if inputs are valid
    const authkey = process.env.NEXT_PUBLIC_AUTH_KEY;
    const name = "service wallah account";
    const mobile = inputData.phoneNumber;
    const country_code = "+91";
    const SID = "13608";
    const otp = generateOTP();
    setGeneratedOtp(otp);

    const url = `https://api.authkey.io/request?authkey=${authkey}&mobile=${mobile}&country_code=${country_code}&sid=${SID}&company=${name}&otp=${otp}`;
    await axios.get(url);
    setOpen4(true);
  };

  const [otpError, setOtpError] = useState("");
  const handleRegisterServiceProvider = async (e) => {
    e.preventDefault();
    if (otp === undefined || otp !== generatedOTP) {
      setOtpError("Invalid OTP");
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
      const response = await fetch("/api/service-providers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      setOpen(true);
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
      console.log(response);
    } catch (error) {
      setOpen(true);
      setPopError(true);
      console.log("Something went wroung while regestering.", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* <div className="">
        <ul className="">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div> */}
      <Dialog
        open={open4}
        handler={handleOpen4}
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
            {otpError && (
              <p className="text-red-500 flex gap-1 text-xs items-center">
                <FaInfoCircle />
                <span>{otpError}</span>
              </p>
            )}
            <p className="text-gray-600 flex gap-1 text-xs items-center">
              <FaInfoCircle />
              <span>
                Please enter the 4-digit OTP sent to your mobile number{" "}
                {inputData.phoneNumber}.
              </span>
            </p>

            <Button
              type="submit"
              color="blue"
              fullWidth
              className="flex justify-center"
              loading={uploadingLoading}
            >
              Verify OTP
            </Button>
          </form>
        </div>
      </Dialog>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        {popError ? (
          <div className="p-6">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={() => window.location.reload()}
                title="Close"
                className="hover:scale-125 transition-all duration-500 ease-in-out "
              >
                <RxCross2 size={25} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-deep-orange-500 font-lato text-center">
              {popError}
            </h1>
            <p className="text-center">Please Try Again later.</p>
            <div className="w-full flex justify-center my-4">
              <Button
                variant="gradient"
                className="rounded-md"
                color="blue"
                onClick={() => window.location.reload()}
              >
                <span>Understood</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={handleOpen}
                title="Close"
                className="hover:scale-125 transition-all duration-500 ease-in-out "
              >
                <RxCross2 size={25} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-teal-500 font-lato text-center">
              You Registered Successfully
            </h1>
            <p className="text-center">
              Wait For admin to approve Your account
            </p>
            <div className="w-full flex justify-center my-4">
              <Button variant="gradient" className="rounded-md" color="blue">
                <button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Understood
                </button>
              </Button>
            </div>
          </div>
        )}
      </Dialog>
      {/* <div className="min-h-full flex justify-center mb-8">
        <div className="flex w-full md:w-2/5 flex-col gap-5 items-center px-8 py-6 h-[85vh] no-scrollbar overflow-auto bg-white bg-opacity-75 border shadow-lg backdrop-blur-sm rounded-xl">
          <div className="w-full flex flex-col items-center justify-center">
            <h2 className="uppercase font-bold text-3xl font-julius text-blue-600">
              Become a service provider
            </h2>
          </div>
          <div className="w-full flex flex-col gap-4 justify-center">
            <Input
              label="Name"
              color="indigo"
              value={inputData.name}
              maxLength={25}
              onChange={(e) =>
                setInputData({ ...inputData, name: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              color="indigo"
              value={inputData.phoneNumber}
              minLength={10}
              maxLength={10}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
              }}
              onChange={(e) =>
                setInputData({ ...inputData, phoneNumber: e.target.value })
              }
            />
            <Input
              label="Email"
              color="indigo"
              type="email"
              value={inputData.email}
              onChange={(e) =>
                setInputData({ ...inputData, email: e.target.value })
              }
            />
            <Select
              label="Gender"
              color="indigo"
              value={inputData.gender}
              onChange={(e) => setInputData({ ...inputData, gender: e })}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
            <div className="flex justify-between">
              <Input
                label="City"
                color="indigo"
                value={inputData.city}
                onChange={(e) =>
                  setInputData({ ...inputData, city: e.target.value })
                }
              />
              <Input
                label="State"
                color="indigo"
                value={inputData.city}
                onChange={(e) =>
                  setInputData({ ...inputData, city: e.target.value })
                }
              />
            </div>
            <Select label="1st Identification Proof">
              <Option>Aadhar Card</Option>
              <Option>PanCard</Option>
              <Option>Driving License</Option>
              <Option>Passport</Option>
              <Option>Ration Card</Option>
            </Select>
            <div className="flex gap-2 cursor-pointer">
              <label htmlFor="icon" className="text-nowrap">
                Upload Documents
              </label>
              <input
                className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="icon"
              />
            </div>
            <Select label="2nd Identification Proof">
              <Option>Aadhar Card</Option>
              <Option>PanCard</Option>
              <Option>Driving License</Option>
              <Option>Passport</Option>
              <Option>Ration Card</Option>
            </Select>
            <div className="flex gap-2 cursor-pointer">
              <label htmlFor="icon" className="text-nowrap">
                Upload Documents
              </label>
              <input
                className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="icon"
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <Input
                label="Password"
                color="indigo"
                type={showPassword ? "text" : "password"}
                minLength={10}
                maxLength={25}
                value={inputData.password}
                onChange={(e) =>
                  setInputData({ ...inputData, password: e.target.value })
                }
              />
              <div
                className="absolute right-14 top-2.5 p-0 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <AiOutlineEye size={20} color="gray" />
                ) : (
                  <AiOutlineEyeInvisible size={20} color="gray" />
                )}
              </div>
              <Tooltip
                content="Password should be more than 10 characters long including letters and numbers"
                placement="top-end"
                className="origin-bottom-right"
                animate={{
                  mount: { scale: 1, y: -5 },
                  unmount: { scale: 0, y: 0 },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-8 w-8 cursor-pointer text-blue-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </Tooltip>
            </div>
            <div className="flex gap-2 cursor-pointer">
              <label htmlFor="icon" className="text-nowrap">
                Profile Image
              </label>
              <input
                className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                onChange={(e) =>
                  setInputData({ ...inputData, image: e.target.files[0] })
                }
                id="icon"
              />
            </div>
            <Button
              // loading={uploadingLoading}
              fullWidth
              variant="gradient"
              color="blue"
              onClick={SendingOtp}
              className="hover:scale-105 transition-all duration-700 flex items-center justify-center py-4 rounded-md shadow-2xl cursor-pointer text-white"
            >
              Verify Mobile Number
            </Button>
          </div>
        </div>
      </div> */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-4xl">
          <CardBody className="flex flex-col gap-8">
            <Typography variant="h3" color="blue" className="text-center">
              Become a Service Provider
            </Typography>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  color="indigo"
                  value={inputData.name}
                  maxLength={25}
                  onChange={(e) =>
                    setInputData({ ...inputData, name: e.target.value })
                  }
                />
                <Input
                  label="Phone Number"
                  color="indigo"
                  value={inputData.phoneNumber}
                  minLength={10}
                  maxLength={10}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
                  }}
                  onChange={(e) =>
                    setInputData({ ...inputData, phoneNumber: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  color="indigo"
                  type="email"
                  value={inputData.email}
                  onChange={(e) =>
                    setInputData({ ...inputData, email: e.target.value })
                  }
                />
                <Select
                  label="Gender"
                  color="indigo"
                  value={inputData.gender}
                  onChange={(e) => setInputData({ ...inputData, gender: e })}
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
                <Select
                  label="State"
                  name="state"
                  color="indigo"
                  value={selectedState}
                  onChange={handleStateChange}
                  required
                >
                  {Object.keys(location).map((state) => (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
                <Select
                  label="City"
                  name="city"
                  color="indigo"
                  value={inputData.city}
                  onChange={handleCityChange}
                  required
                >
                  {cities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="space-y-6">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Identification Documents
                </Typography>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* first id proof section  */}
                  <div className="flex-grow">
                    <Select
                      label="1st Identification Proof"
                      name="firstIdProof"
                      value={inputData.id1.name}
                      onChange={handleId1ProofChange}
                      required
                    >
                      <Option value="aadharcard">Aadhar Card</Option>
                      <Option value="pancard">PAN Card</Option>
                      <Option value="drivinglicense">Driving License</Option>
                      <Option value="passport">Passport</Option>
                      <Option value="rationcard">Ration Card</Option>
                      <Option value="votercard">Voterid Card</Option>
                    </Select>
                  </div>
                  <div className="flex gap-2 cursor-pointer items-center">
                    <label
                      htmlFor="icon"
                      className="text-nowrap text-gray-500 text-sm"
                    >
                      Upload id proof
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded  bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden  file:border-solid file:border-inherit file:bg-neutral-100 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
                      type="file"
                      id="icon"
                      accept=".jpeg, .jpg, .png, .pdf,"
                      onChange={handleid1Upload}
                    />
                  </div>
                </div>
                {/* second id proof section */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-grow">
                    <Select
                      label="2nd Identification Proof"
                      name="secondIdProof"
                      value={inputData.id2.name}
                      onChange={handleId2ProofChange}
                      required
                    >
                      {[
                        "aadharcard",
                        "pancard",
                        "drivinglicense",
                        "passport",
                        "rationcard",
                        "votercard",
                      ]
                        .filter((option) => option !== inputData.id1.name) // Filter out selected id1 option
                        .map((option) => (
                          <Option key={option} value={option}>
                            {option === "aadharcard" && "Aadhar Card"}
                            {option === "pancard" && "PAN Card"}
                            {option === "drivinglicense" && "Driving License"}
                            {option === "passport" && "Passport"}
                            {option === "rationcard" && "Ration Card"}
                            {option === "votercard" && "Voter ID Card"}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <div className="flex gap-2 cursor-pointer items-center">
                    <label
                      htmlFor="icon"
                      className="text-nowrap text-gray-500 text-sm"
                    >
                      Upload id proof
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded  bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden  file:border-solid file:border-inherit file:bg-neutral-100 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
                      type="file"
                      id="icon"
                      onChange={handleid2Upload}
                      accept=".jpeg, .jpg, .png, .pdf,"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Security
                </Typography>
                <div className="flex gap-5">
                  <div className="relative w-full">
                    <Input
                      label="Password"
                      color="indigo"
                      type={showPassword ? "text" : "password"}
                      minLength={10}
                      maxLength={25}
                      value={inputData.password}
                      onChange={(e) =>
                        setInputData({ ...inputData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <Tooltip content="Password should be at least 10 characters long and include letters and numbers">
                    <Typography
                      variant="small"
                      color="gray"
                      className="hidden lg:flex items-center gap-1 cursor-help w-full"
                    >
                      Password requirements
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </Typography>
                  </Tooltip>
                </div>
              </div>

              <div className="md:flex gap-2 items-center w-full">
                <h6 className="w-36 text-black font-semibold mb-5 md:mb-0">
                  Profile Image
                  <span className="text-red-400 ml-1">*</span>
                </h6>
                <input
                  className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded  bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden  file:border-solid file:border-inherit file:bg-neutral-100 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
                  type="file"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      image: e.target.files[0],
                    })
                  }
                  id="icon"
                  accept=".jpeg, .jpg, .png"
                />
              </div>

              <Button
                // loading={uploadingLoading}
                fullWidth
                variant="gradient"
                color="blue"
                onClick={SendingOtp}
                className="hover:scale-105 transition-all duration-700 flex items-center justify-center py-4 rounded-md shadow-2xl cursor-pointer text-white"
              >
                Verify Mobile Number
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateServiceProvider;
