import React, { Suspense } from "react";
import Page from "@/components/bookings/user/BookingPage";

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
      <Page />
    </Suspense>
  );
};

export default page;
