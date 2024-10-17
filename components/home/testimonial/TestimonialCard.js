"use client";
import { Card } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";

const TestimonialCard = ({ name, img, desc, cust, rating }) => {
  function Rating({ stars }) {
    const fullStars = Math.floor(stars);
    const halfStar = stars % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-500">
            &#9733;
          </span> // Full star
        ))}
        {halfStar && <span className="text-yellow-500">&#9734;</span>}

        {[...Array(emptyStars)].map((_, i) => (
          <span key={i}>&#9734;</span> // Empty star
        ))}
      </div>
    );
  }
  return (
    <Card className="h-[330px] p-6 rounded-lg text-center shadow-lg border mb-5">
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
        <Image
          src={img}
          height={96}
          width={96}
          alt="Image"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-semibold text-blue-500">{name}</h3>
      <p className="text-sm text-blue-gray-400">{cust}</p>
      <p className="mt-4 text-[#030637]">&quot;{desc}&quot;</p>
      <div className="mt-4 flex justify-center">
        <Rating stars={rating} />
      </div>
    </Card>
  );
};

export default TestimonialCard;
