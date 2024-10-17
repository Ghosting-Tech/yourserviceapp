import Link from "next/link";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl bg-cover bg-center  ">
      <Link
        href={"/services"}
        className="px-6 py-3 w-full outline transition-all duration-700 flex justify-center items-center rounded-md gap-1 hover:bg-gradient-to-r hover:from-transparent hover:to-transparent hover:text-blue-600 outline-none hover:outline-blue-600 hover:outline-2 bg-gradient-to-tr from-blue-400 to-blue-600 font-semibold text-white"
      >
        Book a Service »
      </Link>
      <div className="flex items-center lg:w-full md:w-full sm:w-full w-full">
        <hr className="flex-grow border-gray-300" />
        <span className="px-4 text-gray-500 font-medium">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <Link
        href={"/become-service-provider"}
        className="px-6 py-3 w-full  transition-all flex gap-1 items-center justify-center duration-700 rounded-md hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white outline outline-2 outline-blue-500 text-blue-500 font-semibold"
      >
        Become a service provider{" "}
        <span className="ml-2">
          <FaUserPlus />
        </span>
      </Link>
    </div>
  );
};

export default CallToAction;
