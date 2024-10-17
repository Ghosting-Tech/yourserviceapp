"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaRegEdit } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  Input,
  DialogFooter,
  Select,
  Option,
  Badge,
  Avatar,
} from "@material-tailwind/react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

const User = () => {
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    image: {
      url: "",
      name: "",
    },
    gender: "",
    locations: "",
    city: "",
    active: "",
    role: "",
    serviceHistory: "",
  });
  const [updateUser, setUpdateUser] = useState({
    image: {
      url: "",
      name: "",
    },
  });
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUpdateUser({ ...updateUser, email });

    // Simple email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Check if the entered email matches the pattern
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError(""); // Clear the error if the email is valid
    }
  };
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  const formattedDate = formatDate(user.createdAt);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const [profileUploaded, setProfileUploaded] = useState(true);
  const handleUploadProfile = async (profileImage) => {
    setProfileUploaded(false);
    try {
      if (!profileImage) {
        alert("Invalid Image");
        return;
      }
      if (updateUser.image.url) {
        await deleteObject(ref(storage, updateUser.image.name));
      }
      const imageRef = ref(
        storage,
        `userprofile/${
          profileImage.lastModified + profileImage.size + profileImage.name
        }`
      );
      await uploadBytes(imageRef, profileImage);
      const imageUrl = await getDownloadURL(imageRef); // Get the profileImage URL directly
      const imageObject = {
        url: imageUrl,
        name: imageRef._location.path_,
      };
      await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updateUser,
          id: user._id,
          image: imageObject,
        }),
      });
      setUpdateUser({ ...updateUser, image: imageObject });
      setProfileUploaded(true);
      // console.log({ imageUrl, imageRef: imageRef._location.path_ });
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdate = async () => {
    if (emailError) {
      return toast.error("Please enter valid email address");
    }
    const response = await fetch("/api/users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...updateUser, id: user._id }),
    });
    const updatedUser = await response.json();
    if (response.ok) {
      setUser(updatedUser);
      setOpen(false);
    }
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchingInitialData = async () => {
      try {
        const user = await axios.get("/api/users/check-authorization");
        if (!user.data.success) {
          toast.error(user.data.message);
        }
        setUser(user.data.user);
        setUpdateUser(user.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchingInitialData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="grid place-items-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="loaction-loader"></div>
            <div className="text-2xl font-julius">Loading</div>
          </div>
        </div>
      ) : (
        <div className="userpage-bg min-h-screen">
          <div className="flex min-h-full flex-col justify-center items-center">
            <div className="w-10/12 mb-4">
              <button
                title="Go Back"
                className="flex gap-1 font-semibold text-gray-700 items-center my-10"
                onClick={router.back}
              >
                <FaArrowLeft /> Profile
              </button>
              <div className="flex flex-col justify-center gap-4">
                <div className="flex gap-4 items-center w-full">
                  {updateUser.image.url || user.image.url ? (
                    <Badge
                      content={<div className="h-3 w-h-3"></div>}
                      overlap="circular"
                      className="bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
                    >
                      <Avatar
                        src={updateUser.image.url || user.image.url}
                        alt="profile picture"
                        className="w-32 h-32 object-cover"
                      />
                    </Badge>
                  ) : (
                    <div className="bg-gray-700 h-32 w-32 font-junge text-white font-bold text-7xl flex justify-center items-center rounded-full">
                      {user.name && Array.from(user.name)[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex gap-1 flex-col justify-center">
                    <span className="text-4xl font-semibold text-gray-800">
                      Hey👋
                    </span>
                    <span className="text-indigo-500 font-semibold text-3xl font-itim tracking-wider">
                      {user.name}
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col items-end gap-4">
                  <div className="flex flex-col gap-6 w-full h-full bg-white bg-opacity-5 backdrop-blur-sm rounded-md shadow px-6 py-4 border border-gray-400">
                    <div className="flex justify-between w-full">
                      <div>Phone Number</div>
                      <div>{user.phoneNumber}</div>
                    </div>
                    <div className="bg-gray-400 h-[1px] w-full"></div>
                    <div className="flex justify-between w-full">
                      <div>Email</div>
                      <div>{user.email}</div>
                    </div>
                    <div className="bg-gray-400 h-[1px] w-full"></div>
                    <div className="flex justify-between w-full">
                      <div>Gender</div>
                      <div>{user.gender}</div>
                    </div>
                    <div className="bg-gray-400 h-[1px] w-full"></div>
                    <div className="flex justify-between w-full">
                      <div>City</div>
                      <div>{user.city}</div>
                    </div>
                    <div className="bg-gray-400 h-[1px] w-full"></div>
                    <div className="flex justify-between w-full">
                      <div>Account Crated on</div>
                      <div>{formattedDate}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href={`/user/bookings?page=1`}
                      className="px-4 py-2 bg-indigo-500 text-white font-bold rounded shadow"
                    >
                      bookings
                    </Link>
                    <button
                      onClick={handleOpen}
                      className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow"
                    >
                      Edit Profile
                    </button>
                    <Dialog
                      open={open}
                      handler={handleOpen}
                      size="lg"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0.9, y: -100 },
                      }}
                    >
                      <h2 className="text-center font-semibold text-gray-700 text-2xl pt-6">
                        Edit Profile
                      </h2>
                      <div className="p-6 flex gap-4 items-center h-full">
                        <div className="flex flex-col gap-4 w-full">
                          <figure className="relative h-36 w-36 rounded-full mx-auto lg:hidden">
                            {updateUser?.image?.url || user?.image?.url ? (
                              <Image
                                width={100}
                                height={100}
                                className="h-full w-full rounded-full object-cover object-center"
                                src={updateUser?.image?.url || user?.image?.url}
                                alt="Profile image"
                              />
                            ) : (
                              <div className="bg-gray-700 h-full w-full font-junge text-white font-bold text-7xl flex justify-center items-center rounded-xl">
                                {user?.name &&
                                  Array.from(user?.name)[0].toUpperCase()}
                              </div>
                            )}
                            <figcaption className="absolute bottom-5  right-0 flex w-3 h-3 -translate-x-2/4 justify-between rounded-lg text-gray-700 font-medium border border-white bg-white/75 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                              <label
                                className="w-full h-1 text-center cursor-pointer"
                                htmlFor="profile"
                              >
                                <FaRegEdit size={25} color="gray" />
                              </label>
                              <input
                                type="file"
                                className="hidden"
                                id="profile"
                                onChange={(e) => {
                                  handleUploadProfile(e.target.files[0]);
                                }}
                              />
                            </figcaption>
                          </figure>
                          <Input
                            onChange={(e) =>
                              setUpdateUser({
                                ...updateUser,
                                name: e.target.value,
                              })
                            }
                            value={updateUser.name}
                            label="Fullname"
                          />
                          <Input
                            disabled
                            onChange={(e) =>
                              setUpdateUser({
                                ...updateUser,
                                phoneNumber: e.target.value,
                              })
                            }
                            value={updateUser.phoneNumber}
                            label="Phone Number"
                          />
                          <Input
                            type="email"
                            onChange={handleEmailChange}
                            value={updateUser.email}
                            label="Email"
                          />

                          <Select
                            label="Gender"
                            value={updateUser.gender}
                            onChange={(val) =>
                              setUpdateUser({
                                ...updateUser,
                                gender: val,
                              })
                            }
                          >
                            <Option value="unspecified">Unspecified</Option>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                          </Select>
                          <Input
                            onChange={(e) =>
                              setUpdateUser({
                                ...updateUser,
                                city: e.target.value,
                              })
                            }
                            value={updateUser.city}
                            label="City"
                          />
                        </div>
                        <figure className="relative h-72 w-3/5 rounded-md hidden lg:block">
                          {updateUser?.image?.url || user?.image?.url ? (
                            <Image
                              width={100}
                              height={100}
                              className="h-full w-full rounded-xl object-cover object-center"
                              src={updateUser?.image?.url || user?.image?.url}
                              alt="Profile image"
                            />
                          ) : (
                            <div className="bg-gray-700 h-full w-full font-junge text-white font-bold text-7xl flex justify-center items-center rounded-xl">
                              {user?.name &&
                                Array.from(user?.name)[0].toUpperCase()}
                            </div>
                          )}
                          <figcaption className="absolute bottom-4 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-lg text-gray-700 font-medium border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                            <label
                              className="w-full h-full text-center cursor-pointer"
                              htmlFor="profile"
                            >
                              change Profile Image
                            </label>
                            <input
                              type="file"
                              className="hidden"
                              id="profile"
                              onChange={(e) => {
                                handleUploadProfile(e.target.files[0]);
                              }}
                            />
                          </figcaption>
                        </figure>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="text"
                          color="red"
                          onClick={handleOpen}
                          className="mr-1"
                        >
                          <span>Cancel</span>
                        </Button>
                        <Button
                          variant="gradient"
                          color="green"
                          loading={!profileUploaded}
                          onClick={handleUpdate}
                        >
                          <span>Update</span>
                        </Button>
                      </DialogFooter>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
