"use client";
import React, { useCallback, useEffect, useState } from "react";
import ShowServices from "@/components/home/ShowServices";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGeolocationDenied } from "@/redux/slice/locationSlice";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import {
  setTopBookedServices,
  setTopBookedServicesLoading,
} from "@/redux/slice/topBookedServicesSlice";

const fetchServices = async (cityState) => {
  try {
    const response = await axios.post(
      "/api/services/top-booked?limit=100",
      cityState
    );
    return response;
  } catch (error) {
    console.error("Error fetching top services:", error);
    return [];
  }
};

const getAddress = async ({ lat, lng }) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const city = data.results[0].address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name;
      const state = data.results[0].address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name;
      return { city, state };
    } else {
      throw new Error("Address not found");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};
const AllServices = () => {
  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setCity] = useState("patna");

  const setSelectedCity = useCallback((city) => {
    setCity(city);
  }, []);

  const dispatch = useDispatch();
  const topBookedServices = useSelector((state) => state.topServices);

  const getServices = useCallback(
    async (cityState, message) => {
      try {
        dispatch(setTopBookedServicesLoading(true));
        const response = await fetchServices(cityState);
        const allServices = response.data;
        if (message && allServices.length === 0) {
          toast.warning(message);
        }
        dispatch(setTopBookedServices(allServices));
        dispatch(setGeolocationDenied(false));
      } catch (error) {
        console.error("Error fetching top services:", error);
      } finally {
        dispatch(setTopBookedServicesLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        dispatch(setTopBookedServicesLoading(false));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          try {
            const cityState = await getAddress(location);
            setSelectedState(cityState.state);
            setSelectedCity(cityState.city);
            getServices(cityState);
            localStorage.setItem("cityState", JSON.stringify(cityState));
          } catch (error) {
            console.log("Error getting address:", error);
            dispatch(setTopBookedServicesLoading(false));
          }
        },
        (error) => {
          console.log("Error getting location:", error.message);
          dispatch(setGeolocationDenied(true));
          dispatch(setTopBookedServicesLoading(false));
        }
      );
    };

    const storedLocation = localStorage.getItem("cityState");
    if (storedLocation) {
      getServices(JSON.parse(storedLocation));
    } else {
      getUserLocation();
    }
  }, [dispatch, getServices, setSelectedCity]);

  const handleLocationChange = () => {
    if (selectedState && selectedCity) {
      const cityState = { state: selectedState, city: selectedCity };
      localStorage.setItem("cityState", JSON.stringify(cityState));
      getServices(
        cityState,
        "No services found for the selected location. Please select a different location."
      );
    }
  };
  return (
    <>
      <div
        className={`grid place-items-center min-h-screen absolute w-full bg-white transition-all duration-700 top-0 ${
          topBookedServices.loading ? "opacity-100" : "opacity-0"
        } ${topBookedServices.loading ? "z-50" : "-z-50"}`}
      >
        <Loading />
      </div>
      <div
        className={`${
          topBookedServices.loading ? "hidden" : "block"
        } transition-all duration-700 mb-10`}
      >
        <div className="w-full flex flex-col justify-center items-center mt-8 px-4">
          <h1 className="font-julius lg:text-5xl md:text-4xl sm:text-3xl text-3xl text-center text-gray-700">
            FOR ALL YOUR NEEDS WE PROVIDES
          </h1>
          <h2 className="font-cookie w-full md:w-auto flex justify-center md:justify-start lg:text-6xl md:text-6xl sm:text-5xl text-5xl text-center text-blue-500 ">
            Best Services
          </h2>
        </div>
        <ShowServices
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          setSelectedCity={setSelectedCity}
          handleLocationChange={handleLocationChange}
          selectedCity={selectedCity}
          forAllService={true}
        />
      </div>
    </>
  );
};

export default AllServices;
