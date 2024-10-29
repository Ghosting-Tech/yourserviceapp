"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { VscLoading } from "react-icons/vsc";
import {
  Button,
  ListItem,
  ListItemSuffix,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaSlash, FaUserAltSlash } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";
import ServiceProviderLocation from "@/components/service-provider/ServiceProviderLocation";
import ServicesList from "@/components/service-provider/ServiceList";
import Link from "next/link";
import { RiSecurePaymentLine } from "react-icons/ri";
import { PiBook } from "react-icons/pi";

const ServiceProviderDetailsPage = () => {
  const { id } = useParams();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const [serviceProvider, setServiceProvider] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchedServicesFromId, setFetchedServicesFromId] = useState([]);
  const [serviceId, setServiceId] = useState([]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  const fetchingServices = async () => {
    // console.log("calling");
    // console.log({ sid: serviceId });
    try {
      const res = await axios.post(
        `/api/service-providers/services-from-array-of-id`,
        serviceId
      );
      setFetchedServicesFromId(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchServiceProvider = async () => {
    try {
      const response = await axios.get(`/api/service-providers/${id}`);
      const data = await response.data;
      // console.log({ Data: data });
      // console.log({ serviceid: data.services });
      setServiceProvider(data);
      setServiceId(data.services);
    } catch (error) {
      console.error("Failed to fetch service provider:", error);
    } finally {
      setLoading(false);
    }
  };
  const serviceProviderDeactivating = async (user) => {
    try {
      const updatedUser = { ...user, active: !user.active };
      const response = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        toast.success(
          `User ${
            updatedUser.active ? "activated" : "deactivated"
          } successfully`
        );
        fetchServiceProvider();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const serviceProviderDeleting = async (user) => {
    const confirmation = confirm(`Are you sure you want to delete this user?`);
    if (!confirmation) return;
    if (user.image?.url) {
      await deleteObject(ref(storage, user.image.name));
    }
    try {
      const response = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        fetchServiceProvider();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchServiceProvider();
    fetchingServices();
    // eslint-disable-next-line
  }, [id]);

  // Fetch services based on `serviceId` whenever `serviceId` changes
  useEffect(() => {
    if (serviceId.length > 0) {
      fetchingServices();
    }
    //eslint-disable-next-line
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg font-semibold animate-spin my-56">
          <VscLoading size={50} />
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-indigo-500 font-lato text-center">
          Service Provider Details
        </h1>
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button color="indigo">Action</Button>
          </MenuHandler>
          <MenuList>
            <MenuItem>
              <Link
                href={`/admin/bookings?search=${serviceProvider.name}`}
                className="flex gap-3"
              >
                View Bookings
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                href={`/admin/payments?search=${serviceProvider.name}`}
                className="flex gap-3"
              >
                View Payout
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                serviceProviderDeleting(serviceProvider);
              }}
            >
              Delete Service Provider
            </MenuItem>
            <MenuItem
              onClick={() => serviceProviderDeactivating(serviceProvider)}
            >
              <span>{serviceProvider.active ? "Deactivate" : "Activate"}</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div>
        {/* Dialog content */}
        <div className="flex gap-4">
          {serviceProvider?.image?.url ? (
            <Image
              src={serviceProvider.image.url}
              alt={serviceProvider.name}
              width={500}
              height={500}
              className=" max-w-28 aspect-square h-full rounded-md object-cover drop-shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 text-6xl text-black rounded-full flex justify-center items-center font-junge bg-gray-400 cursor-pointer">
              {serviceProvider.name &&
                Array.from(serviceProvider.name)[0].toUpperCase()}
            </div>
          )}
          <div className="flex flex-col gap-1 justify-center">
            <div>
              <span
                className={`border ${
                  serviceProvider.active ? "bg-teal-100" : "bg-red-100"
                }  text-xs ${
                  serviceProvider.active ? "text-teal-700" : "text-red-700"
                }  px-2 py-1 rounded-full`}
              >
                {serviceProvider.active ? "active" : "Inactive"}
              </span>
            </div>
            <h1 className="font-bold text-5xl text-gray-700">
              {serviceProvider.name}
            </h1>
            <div className="text-red-700 text-sm">
              Last visit:{" "}
              {new Date(
                serviceProvider.lastVisit
                  ? serviceProvider.lastVisit
                  : serviceProvider.createdAt
              ).toLocaleDateString("en-US", options)}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 grid grid-cols-1 gap-4 rounded-lg shadow-md mt-6">
          <ListItem>
            Phone Number
            <ListItemSuffix>{serviceProvider.phoneNumber}</ListItemSuffix>
          </ListItem>
          <ListItem>
            E-mail
            <ListItemSuffix>{serviceProvider.email}</ListItemSuffix>
          </ListItem>
          <ListItem>
            Gender
            <ListItemSuffix>{serviceProvider.gender}</ListItemSuffix>
          </ListItem>
          <ListItem>
            City
            <ListItemSuffix>{serviceProvider.city}</ListItemSuffix>
          </ListItem>
          <ListItem>
            Account Created at
            <ListItemSuffix>
              {formatDate(serviceProvider.createdAt)}
            </ListItemSuffix>
          </ListItem>
        </div>
      </div>
      <div className="flex min-h-full flex-col justify-center items-center">
        <div className="min-w-full mb-4">
          <ServicesList
            fetchedServicesFromId={fetchedServicesFromId}
            role="admin"
          />
          <ServiceProviderLocation
            serviceProvider={serviceProvider}
            role="admin"
          />
        </div>
      </div>
      {/* Dialog Footer */}
      {/* <div className="flex items-center gap-2 justify-end p-0 py-5">
        <Link href={`/admin/bookings?search=${serviceProvider.name}`}>
          <Button
            variant="gradient"
            size="sm"
            color="indigo"
            className="flex items-center gap-1 rounded"
          >
            view bookings
            <PiBook />
          </Button>
        </Link>
        <Link href={`/admin/payments?search=${serviceProvider.name}`}>
          <Button
            variant="gradient"
            size="sm"
            color="indigo"
            className="flex items-center gap-1 rounded"
          >
            view payout
            <RiSecurePaymentLine />
          </Button>
        </Link>
        <Button
          variant="gradient"
          size="sm"
          color="deep-orange"
          onClick={() => {
            serviceProviderDeleting(serviceProvider);
          }}
          className="flex items-center gap-1 rounded"
        >
          Delete Service Provider
          <AiOutlineDelete />
        </Button>
        <Button
          variant="gradient"
          color="blue"
          size="sm"
          onClick={() => serviceProviderDeactivating(serviceProvider)}
          className="flex items-center gap-1 rounded"
        >
          <span>{serviceProvider.active ? "Deactivate" : "Activate"}</span>
          <FaUserAltSlash />
        </Button>
      </div> */}
    </div>
  );
};

export default ServiceProviderDetailsPage;
