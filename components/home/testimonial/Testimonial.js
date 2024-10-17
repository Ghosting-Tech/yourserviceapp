"use client";
import { Carousel } from "@material-tailwind/react";
import TestimonialCard from "./TestimonialCard";
import { useState } from "react";

export default function Testimonial() {
  const [isAutoplay, setIsAutoplay] = useState(true);

  return (
    <section className="bg-white text-black py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-500">
          <strong>Our Clients</strong>
        </h2>
        <p className="mt-4 text-gray-600">
          <strong>
            That&apos;s the main thing people are controlled by! Thoughts -
            their perception of themselves!
          </strong>
        </p>
      </div>
      <Carousel
        className="rounded-xl"
        autoplay={isAutoplay}
        transition={{ duration: 1 }}
        loop={true}
      >
        <div
          className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          <div>
            <TestimonialCard
              name="Mithilesh Kr."
              img="/image/hero2.webp"
              cust="Satisfied Customer"
              desc="The platform has revolutionized the way I manage my business, highly recommended!"
              rating="3"
            />
          </div>
          <div className="hidden md:block">
            <TestimonialCard
              name="Salman Ali."
              img="/image/hero3.webp"
              cust="Verified Customer"
              desc="Excellent service and fast delivery, the best experience I've had shopping online."
              rating="1"
            />
          </div>
          <div className="hidden lg:block">
            <TestimonialCard
              name="Manish Kr."
              img="/image/hero4.webp"
              cust="Happy Customer"
              desc="I love the wide variety of products and how easy it is to find what I need."
              rating="2"
            />{" "}
          </div>
        </div>
        <div
          className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          <div>
            <TestimonialCard
              name="Reyaz ali."
              img="/image/hero5.webp"
              cust="Verified Customer"
              desc="The customer support is amazing! They helped me resolve my issue within minutes."
              rating="3"
            />
          </div>
          <div className="hidden md:block">
            <TestimonialCard
              name="Manish Kr."
              img="/image/hero1.webp"
              cust="Satisfied Customer"
              desc="A truly outstanding platform. The interface is user-friendly and the service is top-notch."
              rating="1"
            />
          </div>
          <div className="hidden lg:block">
            <TestimonialCard
              name="Naushad Ahmad."
              img="/image/hero2.webp"
              cust="Verified Customer"
              desc="The connections you make at Web Summit are unparalleled, we met users all over the world."
              rating="2"
            />{" "}
          </div>
        </div>
      </Carousel>
    </section>
  );
}
