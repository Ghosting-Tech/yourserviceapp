import React from "react";
import {
  Button,
  ListItem,
  ListItemSuffix,
  IconButton,
} from "@material-tailwind/react";
import { IoSettings } from "react-icons/io5";
import { MdDelete, MdMedicalServices } from "react-icons/md";
import Image from "next/image";

const ServicesList = ({
  fetchedServicesFromId,
  handleOpen2,
  setUpdatedServices,
  setFetchedServicesFromId,
  updatedServices,
  user,
}) => {
  const handleDeleteService = async (serviceId) => {
    try {
      const deletedServicesFiltered = updatedServices.filter(
        (e) => e !== serviceId
      );

      const response = await fetch(`/api/service-providers/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          services: deletedServicesFiltered,
        }),
      });

      if (response.ok) {
        setUpdatedServices(deletedServicesFiltered);
        setFetchedServicesFromId((prev) =>
          prev.filter((s) => s._id !== serviceId)
        );
      } else {
        console.error("Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col gap-4 items-center my-6">
      <div className="flex items-center md:flex-row flex-col justify-between w-full">
        <h1 className="flex items-center gap-1 text-2xl md:flex-row font-bold text-gray-700">
          <IoSettings size={30} /> Services You Provide
        </h1>
        <Button
          onClick={handleOpen2}
          variant="gradient"
          color="blue"
          size="sm"
          className="mt-3 md:mt-0 flex justify-center items-center whitespace-nowrap gap-1 rounded text-sm px-5 py-3"
        >
          Add New Service <MdMedicalServices size={18} />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {fetchedServicesFromId?.map((service, index) => (
          <ListItem
            key={index}
            ripple={false}
            className="py-2 text-gray-700 text-xl"
          >
            <Image
              width={100}
              height={100}
              src={service?.icon?.url}
              alt=""
              className="w-10 object-cover mr-2"
            />
            {service?.name}
            <ListItemSuffix>
              <IconButton
                variant="text"
                color="red"
                onClick={() => {
                  handleDeleteService(service._id);
                }}
              >
                <MdDelete size={25} />
              </IconButton>
            </ListItemSuffix>
          </ListItem>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
