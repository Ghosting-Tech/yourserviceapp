"use client";
import dynamic from "next/dynamic";
import { Suspense, lazy, useState, useEffect } from "react";
import Loading from "@/components/Loading";
import ShowServices from "@/components/home/ShowServices";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGeolocationDenied } from "@/redux/slice/locationSlice";

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
      "/api/services/top-booked?limit=10",
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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [topServices, setTopServices] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const dispatch = useDispatch();
  const geolocationDenied = useSelector(
    (state) => state.location.geolocationDenied
  );

  const getTopServices = async (cityState) => {
    console.log("In top service");
    setLoading(true);
    try {
      const response = await fetchTopServices(cityState);
      const services = response.data;
      setTopServices(services);
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
            getTopServices(cityState);
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
    console.log({ storedLocation });
    if (storedLocation) {
      console.log("In cityState");
      getTopServices(JSON.parse(storedLocation));
    } else {
      console.log("In getUserLocation");
      getUserLocation();
    }
  }, [dispatch, setLoading]);

  const handleLocationChange = () => {
    if (selectedState && selectedCity) {
      const cityState = { state: selectedState, city: selectedCity };
      localStorage.setItem("cityState", JSON.stringify(cityState));
      getTopServices(cityState);
    }
  };

  // Ensure loading state is set to false if data is successfully fetched
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <HeroMovingIcons />
        <Hero />
        <ShowServices
          topServices={topServices}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          setSelectedCity={setSelectedCity}
          handleLocationChange={handleLocationChange}
          selectedCity={selectedCity}
        />
        <VideoCarousel />
        <ServiceSection />
        <CallToAction />
      </Suspense>
    </main>
  );
}
