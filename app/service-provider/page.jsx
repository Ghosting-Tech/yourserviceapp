"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaHistory } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button, Badge, Avatar } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import ProfileInfo from "@/components/service-provider/ProfileInfo";
import ServicesList from "@/components/service-provider/ServiceList";
import EditProfileDialog from "@/components/service-provider/EditProfileDialog";
import AddServiceDialog from "@/components/service-provider/AddServiceDialog";
import axios from "axios";
import ServiceProviderLocation from "@/components/service-provider/ServiceProviderLocation";

const ServiceProvider = () => {
  const reduxUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState(reduxUser);
  const [allServices, setAllServices] = useState([]);
  const [updatedServices, setUpdatedServices] = useState(
    reduxUser.services || []
  );

  useEffect(() => {
    setUser(reduxUser);
    setUpdatedServices(reduxUser.services || []);
  }, [reduxUser]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [fetchedServicesFromId, setFetchedServicesFromId] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleOpen = () => setOpen(!open);
  const handleOpen2 = () => setOpen2(!open2);

  const getAllService = useCallback(async () => {
    const response = await fetch("/api/services", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setAllServices(data);
  }, []);

  const fetchingServices = useCallback(async () => {
    if (updatedServices.length > 0) {
      try {
        const res = await axios.post(
          `/api/service-providers/services-from-array-of-id`,
          updatedServices
        );
        setFetchedServicesFromId(res.data); // Update the list in the state
      } catch (err) {
        console.log(err);
      }
    } else {
      setFetchedServicesFromId([]); // Clear the list if no services
    }
  }, [updatedServices]);

  useEffect(() => {
    getAllService();
    fetchingServices();
    setLoading(false);
  }, [getAllService, fetchingServices]);

  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="loaction-loader"></div>
          <div className="text-2xl font-julius">Loading</div>
        </div>
      </div>
    );
  }

  return (
    <div>
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
              {user?.image?.url ? (
                <Badge
                  content={<div className="h-3 w-h-3"></div>}
                  overlap="circular"
                  className="bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
                >
                  <Avatar
                    src={user.image.url}
                    alt="profile picture"
                    className="w-32 h-32 object-cover"
                  />
                </Badge>
              ) : (
                <span className="bg-gray-700 h-32 w-32 font-junge text-white font-bold text-7xl flex justify-center items-center rounded-full">
                  {user?.name && Array.from(user.name)[0].toUpperCase()}
                </span>
              )}
              <div className="flex gap-1 flex-col justify-center">
                <span className="text-6xl font-semibold text-gray-800">
                  Hey👋
                </span>
                <span className="text-indigo-500 font-semibold text-3xl font-itim tracking-wider">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center md:flex-row flex-col justify-end w-full">
              <Button
                onClick={handleOpen}
                variant="gradient"
                color="blue"
                className="mt-3 md:mt-0 whitespace-nowrap flex justify-center"
              >
                Edit Profile
              </Button>
            </div>
            <ProfileInfo user={user} />
          </div>

          <ServicesList
            fetchedServicesFromId={fetchedServicesFromId}
            handleOpen2={handleOpen2}
            setUpdatedServices={setUpdatedServices}
            setFetchedServicesFromId={setFetchedServicesFromId}
            updatedServices={updatedServices}
            user={user}
          />
          <ServiceProviderLocation serviceProvider={user} />
        </div>
      </div>
      <EditProfileDialog
        open={open}
        handleOpen={handleOpen}
        user={user}
        setUser={setUser}
      />
      <AddServiceDialog
        open={open2}
        handleOpen={handleOpen2}
        allServices={allServices}
        updatedServices={updatedServices}
        setUpdatedServices={setUpdatedServices}
        user={user}
        setUser={setUser}
        fetchingServices={fetchingServices}
      />
    </div>
  );
};

export default ServiceProvider;
