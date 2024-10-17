import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogFooter,
  Button,
  ListItem,
  ListItemPrefix,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";

const AddServiceDialog = ({
  open,
  handleOpen,
  allServices,
  updatedServices,
  setUpdatedServices,
  user,
  setUser,
  fetchingServices,
}) => {
  // Temporary state to hold selected services in the dialog
  const [selectedServices, setSelectedServices] = useState([]);

  // Initialize the selectedServices when the dialog is opened
  useEffect(() => {
    setSelectedServices(updatedServices);
  }, [open, updatedServices]);

  const handleUpdateServices = async () => {
    const response = await fetch(`/api/users/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, services: selectedServices }),
    });
    const updatedUser = await response.json();
    if (response.status === 201) {
      setUser(updatedUser);
      setUpdatedServices(selectedServices); // Update the services
      handleOpen();
      fetchingServices();
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <h2 className="text-center font-semibold text-gray-700 text-2xl pt-6">
        All Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4  min-h-52 overflow-auto no-scrollbar">
        {allServices?.map((service, index) => (
          <ListItem className="p-0" key={index}>
            <label
              htmlFor={service._id}
              className="flex w-full cursor-pointer items-center px-3 py-2"
            >
              <ListItemPrefix className="mr-3">
                <Checkbox
                  id={service._id}
                  checked={selectedServices.includes(service._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedServices((prev) => [...prev, service._id]);
                    } else {
                      setSelectedServices((prev) =>
                        prev.filter((id) => id !== service._id)
                      );
                    }
                  }}
                  value={service.name}
                  ripple={false}
                  className="hover:before:opacity-0"
                  containerProps={{
                    className: "p-0",
                  }}
                />
              </ListItemPrefix>
              <Image
                width={100}
                height={100}
                src={service.icon.url}
                alt=""
                className="w-10 object-cover mr-2"
              />
              <Typography
                color="blue-gray"
                className="font-medium whitespace-nowrap"
              >
                {service.name}
              </Typography>
            </label>
          </ListItem>
        ))}
      </div>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleUpdateServices}>
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddServiceDialog;
