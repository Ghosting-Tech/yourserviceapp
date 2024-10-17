import Booking from "@/components/bookings/service-provider/BookingPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="loaction-loader"></div>
            <div className="text-2xl font-julius">Loading</div>
          </div>
        </div>
      }
    >
      <Booking />
    </Suspense>
  );
};

export default page;
