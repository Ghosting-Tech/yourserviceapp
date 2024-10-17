import Loading from "@/components/Loading";
import React, { Suspense } from "react";

const UsersContainer = React.lazy(() => {
  return import("@/components/admin/user/UsersContainer");
});

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UsersContainer />
    </Suspense>
  );
}
