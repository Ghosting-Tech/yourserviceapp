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
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import location from "../../../state&city/location.json";
import VerifyOtp from "@/components/become-service-provider/dialog/VerifyOtp";
import sendSmsMessage from "@/utils/sendSmsMessage";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { GoAlertFill } from "react-icons/go";
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
    if (selectedState) {
      setCities(location[selectedState] || []);
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
    if (inputData.image.size >= 2000000) {
      toast.error("Please upload the profile image less than 2Mb");
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
    if (inputData.id1.image.file.size >= 2000000) {
      toast.error("Please upload the first id  image less than 2Mb");
      isValid = false;
      return;
    }
    if (inputData.id2.image.file.size >= 2000000) {
      toast.error("Please upload the second id image less than 2Mb");
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

  const [openVerifyOtpDialog, setOpenVerifyOtpDialog] = useState(false);

  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  function generateOTP() {
    // Generate a random number between 1000 and 9999
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
  }
  const [generatedOTP, setGeneratedOtp] = useState();
  const SendingOtp = async () => {
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

    const otp = generateOTP();
    setGeneratedOtp(otp);

    const sms = await sendSmsMessage(
      inputData.phoneNumber,
      `Dear user, Your OTP for phone number verification is ${otp}. Please enter this OTP to complete the registration process. Regards, Ghosting Webtech Pvt Ltd`,
      "1707172906187016975"
    );

    if (!sms.success) {
      toast.error("Failed to send verification OTP.");
      return;
    }
    setOpenVerifyOtpDialog(true);
    // Disable the OTP button and start the timer
    setIsOtpButtonDisabled(true);
    setTimer(30);
  };

  useEffect(() => {
    console.log(inputData);
  }, [inputData]);

  return (
    <div className="min-h-screen">
      <VerifyOtp
        open={openVerifyOtpDialog}
        setOpen={setOpenVerifyOtpDialog}
        generatedOTP={generatedOTP}
        inputData={inputData}
        setInputData={setInputData}
        SendingOtp={SendingOtp}
        isOtpButtonDisabled={isOtpButtonDisabled}
        setIsOtpButtonDisabled={setIsOtpButtonDisabled}
        timer={timer}
        setTimer={setTimer}
        handleOpenResponseDialog={handleOpen}
      />

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
                <div className="relative w-full">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full"
                    name="state"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setInputData({ ...inputData, state: e.target.value });
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {Object.keys(location).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="relative w-full">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full"
                    name="city"
                    value={inputData.city}
                    onChange={(e) => {
                      setInputData({ ...inputData, city: e.target.value });
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>
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
                      accept=".jpeg, .jpg, .png"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Security
                </Typography>
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
                <div className="text-sm text-deep-orange-500 flex items-center gap-1">
                  <GoAlertFill />
                  Password should be at least 10 characters long and include
                  letters and numbers
                </div>
              </div>

              <div className="md:flex gap-2 items-center w-full">
                <h6 className="w-36 text-black font-semibold mb-5 md:mb-0">
                  Profile Image
                  <span className="text-red-400 ml-1">*</span>
                </h6>
                <input
                  className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded  bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden  file:border-solid file:border-inherit file:bg-neutral-100 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                size="lg"
                variant="gradient"
                color="blue"
                onClick={SendingOtp}
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
