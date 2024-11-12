"use client";
import dynamic from "next/dynamic";
import { Suspense, lazy, useState, useEffect, useCallback } from "react";
import Loading from "@/components/Loading";
import ShowServices from "@/components/home/ShowServices";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGeolocationDenied } from "@/redux/slice/locationSlice";
import Testimonial from "@/components/home/testimonial/Testimonial";
import Blogs from "@/components/BlogSection";
import { toast } from "sonner";
import {
  setTopBookedServices,
  setTopBookedServicesLoading,
} from "@/redux/slice/topBookedServicesSlice";

// Dynamically import components
const Hero = dynamic(() => import("@/components/home/Hero"), { ssr: false });
const HeroMovingIcons = dynamic(
  () => import("@/components/home/HeroMovingIcons"),
  { ssr: false }
);
const CallToAction = dynamic(() => import("@/components/home/CallToAction"), {
  ssr: false,
});

// Lazy load components
const ServiceSection = lazy(() => import("../components/home/ServiceSection"));
const VideoCarousel = lazy(() => import("../components/home/VideoCarousel"));

const fetchTopServices = async (cityState) => {
  try {
    const response = await axios.post(
      "/api/services/top-booked?limit=100",
      cityState
    );
    console.log("Top services response:", response.data);
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

export default function Home() {
  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setCity] = useState("patna");

  const setSelectedCity = useCallback((city) => {
    setCity(city);
  }, []);

  const dispatch = useDispatch();
  const topBookedServices = useSelector((state) => state.topServices);

  const getTopServices = useCallback(
    async (cityState, message) => {
      try {
        dispatch(setTopBookedServicesLoading(true));
        const response = await fetchTopServices(cityState);
        const allServices = response.data;
        dispatch(setTopBookedServicesLoading(false));
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
            getTopServices(cityState);
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
    if (storedLocation && topBookedServices.services.length === 0) {
      getTopServices(JSON.parse(storedLocation));
    } else {
      getUserLocation();
    }
  }, [dispatch, getTopServices, setSelectedCity]);

  const handleLocationChange = () => {
    if (selectedState && selectedCity) {
      const cityState = { state: selectedState, city: selectedCity };
      localStorage.setItem("cityState", JSON.stringify(cityState));
      getTopServices(
        cityState,
        "No services found for the selected location. Please select a different location."
      );
    }
  };

  if (topBookedServices.loading) return <Loading />;

  return (
    <main>
      <>
        <HeroMovingIcons />
        <Hero />
        <ShowServices
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          setSelectedCity={setSelectedCity}
          handleLocationChange={handleLocationChange}
          selectedCity={selectedCity}
          forAllService={false}
        />
        <VideoCarousel />
        <ServiceSection />
        <CallToAction />
        <Testimonial />
        <Blogs />
      </>
    </main>
  );
}
