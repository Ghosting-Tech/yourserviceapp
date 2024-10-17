import Loading from "@/components/Loading";
import React, { Suspense } from "react";

const BookingContainer = React.lazy(() => {
  return import("@/components/admin/bookings/single-booking/BookingContainer");
});

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <BookingContainer />
    </Suspense>
  );
}
