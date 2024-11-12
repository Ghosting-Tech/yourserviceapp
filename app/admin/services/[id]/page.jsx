"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Carousel, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import { toast } from "sonner";
import SubServiceCard from "@/components/admin/services/SubServiceCard";
import Loading from "@/components/Loading";
import CreateSubService from "@/components/admin/services/sub-services/CreateSubService";
import formatDate from "@/utils/formatDate";
import ServiceActions from "@/components/admin/services/ServiceActions";

const ServicePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState({
    bookings: [],
    subServices: [],
    cities: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchingInitialData = async () => {
    try {
      const res = await fetch(`/api/services/${id}`);
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        router.back();
        return;
      }
      setService(data.service);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingInitialData();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="px-4 md:px-20 my-6 flex flex-col gap-6">
            <div className="flex gap-4 justify-between">
              <button
                onClick={router.back}
                className="text-xl flex gap-1 items-center cursor-pointer text-gray-700"
                title="Go Back"
              >
                <FaArrowLeft />
                Service Details
              </button>
              <ServiceActions
                id={id}
                updateService={service}
                setUpdateService={setService}
              />
            </div>

            <div className="md:flex gap-4 justify-center md:justify-between">
              <div className="flex gap-4 items-center justify-center md:justify-start mb-5 md:mb-0 ">
                <Image
                  width={1000}
                  height={1000}
                  src={service.icon?.url}
                  alt=""
                  className="w-24 lg:w-60 aspect-square rounded-md object-cover drop-shadow-lg"
                />
                <div className="flex flex-col gap-2 justify-center">
                  <div>
                    <span
                      className={`border ${
                        service.status === "active"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-red-100 text-red-700"
                      }  text-xs px-2 py-1 rounded-full`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <h1 className="font-bold text-5xl text-gray-700">
                    {service.name}
                  </h1>
                  <p className="text-sm text-gray-600  overflow-y-auto no-scrollbar pl-2 max-h-32 max-w-96">
                    {service.description}
                  </p>
                  <div className="text-sm">{formatDate(service.createdAt)}</div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-6 w-full md:w-1/2">
                <Carousel
                  className="rounded-md w-full max-h-72 overflow-hidden"
                  loop
                  prevArrow={({ handlePrev }) => (
                    <IconButton
                      variant="text"
                      color="white"
                      size="lg"
                      onClick={handlePrev}
                      className="!absolute top-2/4 left-4 -translate-y-2/4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                      </svg>
                    </IconButton>
                  )}
                  nextArrow={({ handleNext }) => (
                    <IconButton
                      variant="text"
                      color="white"
                      size="lg"
                      onClick={handleNext}
                      className="!absolute top-2/4 !right-4 -translate-y-2/4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </IconButton>
                  )}
                >
                  {service.images?.map((image) => {
                    return (
                      <Image
                        width={1000}
                        height={1000}
                        key={image.name}
                        src={image.url}
                        alt=""
                        className="h-96 w-full object-cover"
                      />
                    );
                  })}
                </Carousel>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="lg:block text-3xl hidden font-bold text-indigo-500 font-lato text-center">
                Sub Services
              </h1>
              <CreateSubService id={id} setService={setService} />
            </div>
            <div className="h-px bg-gray-400 w-full"></div>

            <div className="flex justify-center md:justify-start flex-wrap gap-3 mx-auto md:mx-0">
              {service.subServices?.map((sub, index) => {
                return (
                  <SubServiceCard
                    forAdmin={true}
                    key={index}
                    sub={sub}
                    index={index}
                    serviceId={id}
                    subServices={service.subServices}
                    fetchingInitialData={fetchingInitialData}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicePage;
