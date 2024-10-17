import Loading from "@/components/Loading";
import {
  Button,
  Dialog,
  IconButton,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { toast } from "sonner";

const AssignServiceProvider = ({ bookingId, setBooking }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(!openDialog);

  const [serviceProviders, setServiceProviders] = useState([]);
  const [filterByStatus, setFilterByStatus] = useState("both");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for data fetch

  const fetchingServiceProviders = useCallback(async () => {
    const page = 1;
    const limit = 12;
    try {
      const response = await fetch(
        `/api/admin/service-providers?page=${page}&limit=${limit}&search=${searchQuery}&status=${filterByStatus}`
      );
      const data = await response.json();
      if (data.success) {
        setServiceProviders(data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [filterByStatus, searchQuery]);

  useEffect(() => {
    fetchingServiceProviders();
  }, [fetchingServiceProviders]);

  const handleAssigning = async (serviceProviderId) => {
    try {
      const response = await axios.post(
        `/api/admin/bookings/assign-service-provider`,
        { bookingId, serviceProviderId }
      );
      const data = await response.data;
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setBooking(data.booking)
      handleOpenDialog()
    } catch (error) {
      console.log(error);
      toast.error("Error assigning service provider");
    }
  };

  return (
    <div className="flex flex-col gap-4 py-1">
      <h3 className="text-md md:text-xl font-semibold mb-4 text-gray-800">
        No service provider assigned
      </h3>

      {/* Button Section */}
      <Button
        size="md"
        variant="gradient"
        color="blue"
        className="flex gap-3 items-center justify-center"
        onClick={handleOpenDialog}
      >
        <FaPlus className="text-lg" />
        <span>Assign Service Provider</span>
      </Button>
      <Dialog
        open={openDialog}
        handler={handleOpenDialog}
        className="p-6"
        size="lg"
      >
        <div className="flex justify-between items-center">
          <div className="text-lg font-normal">Assign Service provider</div>
          <div className="flex md:w-fit w-full md:flex-row flex-col gap-3 items-center">
            <div className="md:w-72 w-full">
              <Input
                label="Search Users"
                className="bg-white"
                icon={<IoIosSearch />}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                color="indigo"
              />
            </div>
            <div className="md:w-60 w-full bg-white">
              <Select
                label="Filter By Status"
                value={filterByStatus}
                color="indigo"
                onChange={(value) => setFilterByStatus(value)}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="both">Both</Option>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {serviceProviders.map((provider) => {
              return (
                <div
                  key={provider._id}
                  className="flex gap-4 items-center justify-between px-4 py-2 rounded-lg transition-all border hover:bg-gray-100 w-full"
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={provider.image.url}
                      alt={provider.name}
                      width={200}
                      height={200}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col justify-center">
                      <span
                        className={`border w-fit ${
                          provider.active ? "bg-teal-100" : "bg-red-100"
                        }  text-xs ${
                          provider.active ? "text-teal-700" : "text-red-700"
                        }  px-2 py-1 rounded-full`}
                      >
                        {provider.active ? "active" : "Inactive"}
                      </span>
                      <span>{provider.name}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="gradient"
                    color="blue"
                    onClick={() => handleAssigning(provider._id)}
                  >
                    Assign
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AssignServiceProvider;
