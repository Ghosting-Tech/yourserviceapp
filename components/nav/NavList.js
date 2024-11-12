import { Button, List, Dialog, DialogBody } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping, FaLocationDot } from "react-icons/fa6";
import { IoMdOpen } from "react-icons/io";
import Link from "next/link";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Image from "next/image";
import ServicesList from "./ServiceList";
import { useSelector } from "react-redux";

export default function NavList() {
  const [open2, setOpen2] = useState(false);

  const handleOpen2 = () => setOpen2(!open2);

  const [topServices, setTopServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchError, setSearchError] = useState("");

  const topBookedServices = useSelector((state) => state.topServices);
  const gettingServices = async () => {
    try {
      const storedLocation = localStorage.getItem("cityState");
      if (!storedLocation && topBookedServices.services.length <= 0) {
        return;
      }
      const fetchedData = await fetch("/api/services/top-booked?limit=100", {
        method: "POST",
        body: JSON.stringify(storedLocation),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await fetchedData.json();
      console.log(response);
      function getTopBookedServices(services, topN) {
        return services
          .sort((a, b) => b.bookings.length - a.bookings.length)
          .slice(0, topN);
      }

      const topServices = getTopBookedServices(response, 6);
      setAllServices(response);
      setTopServices(topServices);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    gettingServices();
  }, []);

  const fuseOptions = {
    keys: ["name", "subServices.name"],
    includeScore: true,
    threshold: 0.3,
  };

  // Flatten the data array to include both services and their sub-services
  const flattenedData = allServices.flatMap((service) => [
    service,
    ...service.subServices.map((subService) => ({
      ...subService,
      parentServiceName: service.name,
      parentServiceId: service._id,
    })),
  ]);

  const fuse = new Fuse(flattenedData, fuseOptions);
  function handleSerch(query) {
    if (!query) {
      setSearchError("");
      setSearchedData([]);
      return;
    }

    const result = fuse.search(query);

    if (result.length === 0) {
      setSearchError("No matching service found");
    }
    setSearchedData(result);
  }
  const [location, setLocation] = useState("Location");

  useEffect(() => {
    // Access localStorage only on the client side
    const cityState = JSON.parse(localStorage.getItem("cityState"));
    if (cityState?.city) {
      setLocation(cityState.city);
    }
  }, []);
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1 md:gap-4">
      <ServicesList />
      <div className="flex gap-2 justify-evenly">
        <Link
          href="/location"
          className="flex gap-2 w-full border bg-white border-gray-300 hover:bg-gray-200 shadow py-2 px-4 rounded-md justify-center items-center"
        >
          {location}
          <FaLocationDot size={18} color="#F44336" />
        </Link>

        <button
          onClick={handleOpen2}
          variant="gradient"
          className="flex gap-2 border bg-white border-gray-300 hover:bg-gray-200 shadow py-3 px-4 rounded-full justify-center items-center"
        >
          <FaSearch />
        </button>

        <div className="relative">
          <Link
            href={"/cart"}
            variant="gradient"
            className="flex gap-2 border bg-white border-gray-300 hover:bg-gray-200 shadow py-3 px-3 rounded-full justify-center items-center"
          >
            <FaCartShopping size={20} />
          </Link>
        </div>
        <Dialog
          open={open2}
          size="lg"
          handler={handleOpen2}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogBody className="p-10 min-h-[90vh] bg-gray-100 rounded-xl">
            <div className="flex gap-3 mb-4 md:mb-10 justify-center items-center">
              <h1 className="text-2xl md:text-4xl font-julius uppercase">
                Search For Service
              </h1>
              <h2 className="text-3xl md:text-5xl font-cookie text-blue-500">
                You like
              </h2>
            </div>
            <Input
              label="Search a Service"
              color="blue"
              onChange={(e) => handleSerch(e.target.value)}
              icon={<FaSearch className="cursor-pointer text-blue-500" />}
            />
            <div>
              <div className="flex gap-2 items-center my-4">
                <h2 className="whitespace-nowrap text-gray-500 text-xs">
                  Most Booked Services You may like
                </h2>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3  overflow-auto no-scrollbar">
                {searchError ? (
                  <div>{searchError}</div>
                ) : searchedData.length <= 0 ? (
                  topServices.map((service, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg py-4 px-4"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            width={100}
                            height={100}
                            src={service.icon.url}
                            alt={service.name}
                            className="w-10 h-10 md:w-16 md:h-16 rounded-md"
                          />
                          <div className="flex flex-col items-center gap-1 w-full">
                            <h2 className="text-gray-700 font-julius font-semibold text-center">
                              {service.name}
                            </h2>
                            {/* <p className="text-gray-500">{service.name}</p> */}
                            <Link href={`/services/${service._id}`}>
                              <Button
                                variant="gradient"
                                color="blue"
                                className="rounded w-full flex items-center gap-1"
                                size="sm"
                                onClick={handleOpen2}
                              >
                                View <IoMdOpen />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  searchedData.map((service, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg py-4 px-4 h-fit"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            width={100}
                            height={100}
                            src={service.item.icon.url}
                            alt={service.item.name}
                            className="w-10 h-10 md:w-16 md:h-16 rounded-md"
                          />
                          <div className="flex flex-col items-center gap-1 w-full">
                            <h2 className="text-gray-700 font-julius font-semibold text-center">
                              {service.item.name}
                            </h2>
                            {/* <p className="text-gray-500">{service.item.name}</p> */}
                            <Link
                              href={`/services/${
                                service.item.parentServiceId
                                  ? service.item.parentServiceId
                                  : service.item._id
                              }`}
                            >
                              <Button
                                variant="gradient"
                                color="blue"
                                className="rounded w-full flex items-center gap-1"
                                size="sm"
                                onClick={handleOpen2}
                              >
                                View <IoMdOpen />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </List>
  );
}
