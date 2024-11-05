import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogFooter,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "sonner";
import location from "../../state&city/location.json";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const EditProfileDialog = ({ open, handleOpen, user, setUser }) => {
  const [updateUser, setUpdateUser] = useState(user);
  const [profileUploaded, setProfileUploaded] = useState(true);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(user.state || ""); // Initialize selectedState with user.state if available

  // Update cities whenever selectedState changes
  useEffect(() => {
    if (selectedState) {
      setCities(location[selectedState] || []);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  // Ensure the city list is updated if the component initially loads with a selected state
  useEffect(() => {
    if (updateUser.state) {
      setSelectedState(updateUser.state);
      setCities(location[updateUser.state] || []);
    }
  }, [updateUser.state]);

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

  useEffect(() => {
    setUpdateUser(user);
  }, [user]);

  const handleUploadProfile = async (profileImage) => {
    if (!profileImage) {
      alert("Invalid Image");
      return;
    }
    setProfileUploaded(false);
    try {
      const imageRef = ref(
        storage,
        `service-provider/${Date.now()}_${profileImage.name}`
      );
      if (updateUser.image.url) {
        await deleteObject(ref(storage, updateUser.image.name));
      }
      await uploadBytes(imageRef, profileImage);
      const imageUrl = await getDownloadURL(imageRef);
      const imageObject = { url: imageUrl, name: imageRef._location.path_ };
      setUpdateUser((prev) => ({ ...prev, image: imageObject }));
      setProfileUploaded(true);
    } catch (err) {
      console.error(err);
      setProfileUploaded(true);
    }
  };

  const handleUpdate = async () => {
    if (emailError) {
      return toast.error("Please enter valid email address");
    }
    const response = await fetch(`/api/service-providers/${user._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateUser),
    });
    if (response.ok) {
      setUser(updateUser);
      handleOpen();
    }
  };

  return (
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
                {user?.name && Array.from(user?.name)[0].toUpperCase()}
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
            // onChange={(e) =>
            //   setUpdateUser({
            //     ...updateUser,
            //     email: e.target.value,
            //   })
            // }
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
          <div className="flex gap-2">
            <div className="relative w-full">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full"
                name="state"
                value={selectedState}
                onChange={(e) => {
                  const state = e.target.value;
                  setSelectedState(state);
                  setUpdateUser({
                    ...updateUser,
                    state,
                    city: "", // Reset city when state changes
                  });
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
                value={updateUser.city || ""}
                onChange={(e) => {
                  setUpdateUser({
                    ...updateUser,
                    city: e.target.value,
                  });
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
        </div>
        <figure className="relative h-72 w-3/5 rounded-md hidden lg:block">
          {updateUser?.image?.url ? (
            <Image
              width={100}
              height={100}
              className="h-full w-full rounded-xl object-cover object-center"
              src={updateUser.image.url}
              alt="Profile image"
            />
          ) : (
            <div className="bg-gray-700 h-full w-full font-junge text-white font-bold text-7xl flex justify-center items-center rounded-xl">
              {updateUser?.name && Array.from(updateUser.name)[0].toUpperCase()}
            </div>
          )}

          <label
            className="w-full h-full text-center cursor-pointer"
            htmlFor="profile"
          >
            <figcaption className="absolute bottom-4 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-center rounded-lg text-gray-700 font-medium border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
              Change Profile Image
              <input
                type="file"
                className="hidden"
                id="profile"
                onChange={(e) => {
                  handleUploadProfile(e.target.files[0]);
                }}
              />
            </figcaption>
          </label>
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
  );
};

export default EditProfileDialog;
