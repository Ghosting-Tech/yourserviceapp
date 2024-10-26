import React, { Suspense } from "react";
import BookingPage from "@/components/bookings/user/BookingPage";

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
      <BookingPage />
    </Suspense>
  );
};

export default page;
