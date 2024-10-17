import Loading from "@/components/Loading";
import React, { Suspense } from "react";

const ServiceProvidersContainer = React.lazy(() => {
  return import(
    "@/components/admin/service-provider/ServiceProvidersContainer"
  );
});

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ServiceProvidersContainer />
    </Suspense>
  );
}
