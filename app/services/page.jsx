"use client";
import React, { useEffect, useState } from "react";
import ShowServices from "@/components/home/ShowServices";
import axios, { all } from "axios";
import { useDispatch } from "react-redux";
import { setGeolocationDenied } from "@/redux/slice/locationSlice";
import Loading from "@/components/Loading";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);
  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setSelectedCity] = useState("patna");

  const dispatch = useDispatch();

  const getServices = async (cityState, message) => {
    try {
      const response = await fetchServices(cityState);
      const allServices = response.data;
      if (message && allServices.length === 0) {
        toast.warning(message);
      }
      setServices(allServices);
      dispatch(setGeolocationDenied(false));
    } catch (error) {
      console.error("Error fetching top services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        setLoading(false);
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
            setLoading(false);
          }
        },
        (error) => {
          console.log("Error getting location:", error.message);
          dispatch(setGeolocationDenied(true));
          setLoading(false);
        }
      );
    };

    const storedLocation = localStorage.getItem("cityState");
    if (storedLocation) {
      getServices(JSON.parse(storedLocation));
    } else {
      getUserLocation();
    }
  }, [dispatch, setLoading]);

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
          loading ? "opacity-100" : "opacity-0"
        } ${loading ? "z-50" : "-z-50"}`}
      >
        <Loading />
      </div>
      <div
        className={`${
          loading ? "hidden" : "block"
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
          topServices={services}
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
