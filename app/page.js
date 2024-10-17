"use client";
import { useState, useEffect, Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Loading from "@/components/Loading";
import Testimonial from "@/components/home/testimonial/Testimonial";
import Blogs from "@/components/BlogSection";

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
const ServiceSection = lazy(() => import("../components/ServiceSection"));
const VideoCarousel = lazy(() => import("../components/home/VideoCarousel"));
const TopServices = lazy(() => import("@/components/home/TopServices"));

// Fetch top services function
const fetchTopServices = async () => {
  try {
    const { data } = await axios.get("/api/services/top-booked?limit=10");
    return data;
  } catch (error) {
    console.error("Error fetching top services:", error);
    return [];
  }
};


export default function Home() {
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopServices = async () => {
      setLoading(true);
      const services = await fetchTopServices();
      setTopServices(services);
      setLoading(false);
    };
    getTopServices();
  }, []);

  if (loading) return <Loading />;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <HeroMovingIcons />
        <Hero />
        <TopServices topServices={topServices} />
        <VideoCarousel />
        <ServiceSection />
        <CallToAction />
        <Testimonial />
        <Blogs />
      </Suspense>
    </main>
  );
}
