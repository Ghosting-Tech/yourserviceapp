"use client";
import { storage } from "@/firebase";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogFooter,
  Input,
  ListItem,
  ListItemSuffix,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdOpen } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TiArrowRepeat } from "react-icons/ti";
import { toast } from "sonner";

const SubServiceCard = ({
  sub,
  index,
  serviceId,
  subServices,
  fetchingInitialData,
}) => {
  const [subService, setSubService] = useState(sub);
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(!open2);
  const [openEditDailog, setOpenEditDailog] = useState(false);
  const handleAlterEditDailog = () => setOpenEditDailog(!openEditDailog);

  const deleteSubService = async () => {
    try {
      if (subServices.length <= 1) {
        toast.error("Cannot delete the last sub service");
        return;
      }
      const confirmation = confirm(
        "Are you sure you want to delete this sub service?"
      );
      if (!confirmation) return;

      const imageRef = ref(storage, subService.icon.name);

      // Check if the image exists before deleting
      try {
        await getMetadata(imageRef); // If this fails, the object does not exist
        await deleteObject(imageRef); // Delete the object only if it exists
      } catch (err) {
        if (err.code === "storage/object-not-found") {
          console.log("Image not found, skipping deletion");
        } else {
          throw err; // Re-throw if it's a different error
        }
      }

      const res = await fetch(`/api/sub-services`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: subService._id }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchingInitialData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error deleting sub-service:", error);
      toast.error("Failed to delete sub-service");
    }
  };

  const handleReplaceIcon = async (image) => {
    try {
      if (!image) return;
      try {
        await deleteObject(ref(storage, subService.icon.name));
      } catch (error) {
        console.log("Error deleting previous image:", error);
      }
      const iconRef = ref(
        storage,
        `subServiceIcons/${image.lastModified + image.size + image.name}`
      );
      await uploadBytes(iconRef, image);
      const iconUrl = await getDownloadURL(iconRef); // Get the image URL directly
      const iconObject = { url: iconUrl, name: iconRef._location.path_ };
      const postData = { ...subService, icon: iconObject };
      setSubService(postData);
      const res = await fetch(`/api/sub-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setOpen2(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateSubServiceDetails = async () => {
    try {
      const res = await fetch(`/api/sub-services`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subService),
      });
      const data = await res.json();
      setOpenEditDailog(false);
      if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="w-full max-w-72" key={index}>
      <Image
        width={1000}
        height={1000}
        src={subService?.icon?.url}
        alt="Service Icon"
        className="object-cover aspect-square"
      />
      <CardBody>
        <div className="mb-1 flex flex-col justify-start gap-2">
          <div>
            <span
              className={`border ${
                subService.status === "active" ? "bg-teal-100" : "bg-red-100"
              }  text-xs ${
                subService.status === "active"
                  ? "text-teal-700"
                  : "text-red-700"
              }  px-2 py-1 rounded-full`}
            >
              {subService.status}
            </span>
          </div>
          <Typography variant="h4" color="blue-gray" className="font-medium">
            {subService.name}
          </Typography>
        </div>
        <div className="text-2xl font-bold text-teal-500">
          ₹{subService.price}
        </div>
      </CardBody>
      <CardFooter className="pt-0 flex flex-col gap-2">
        <Button
          size="lg"
          fullWidth={true}
          onClick={handleOpen2}
          variant="gradient"
          color="indigo"
          className="flex gap-1 items-center justify-center"
        >
          View <IoMdOpen size={20} />
        </Button>
        <Dialog
          size="md"
          className="bg-gray-200"
          open={open2}
          handler={handleOpen2}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl font-bold text-indigo-500 font-lato text-center">
              Sub Service
            </h1>
            <button
              onClick={handleOpen2}
              title="Close"
              className="hover:scale-125 transition-all duration-500 ease-in-out"
            >
              <RxCross2 size={25} />
            </button>
          </div>

          <div className="flex gap-4 px-6">
            <Image
              width={100}
              height={100}
              src={subService.icon?.url}
              alt=""
              className="w-32 h-full rounded-md object-cover drop-shadow-lg aspect-square"
            />
            <div className="flex flex-col gap-2 justify-center">
              <div>
                <span
                  className={`border ${
                    subService.status === "active"
                      ? "bg-teal-100"
                      : "bg-red-100"
                  }  text-xs ${
                    subService.status === "active"
                      ? "text-teal-700"
                      : "text-red-700"
                  }  px-2 py-1 rounded-full`}
                >
                  {subService.status}
                </span>
              </div>
              <h1 className="font-bold text-5xl text-gray-700">
                {subService.name}
              </h1>
              <p className="text-xl text-teal-500 font-semibold">
                ₹{subService.price}
              </p>
            </div>
          </div>
          <DialogFooter>
            <label
              htmlFor="icon"
              className="flex items-center gap-1 mr-1 h-full px-2 py-1 bg-gray-700 text-white rounded-md cursor-pointer"
            >
              Replace Icon <TiArrowRepeat size={18} />
              <input
                type="file"
                className="hidden"
                id="icon"
                onChange={(e) => handleReplaceIcon(e.target.files[0])}
              />
            </label>
            <Button variant="gradient" color="red" className="mr-1">
              <span
                className="flex items-center gap-1"
                onClick={deleteSubService}
              >
                Delete <MdDelete />
              </span>
            </Button>
            <Button
              variant="gradient"
              color="indigo"
              onClick={handleAlterEditDailog}
            >
              <span className="flex items-center gap-1">
                Edit <MdEdit />
              </span>
            </Button>
            <Dialog
              size="sm"
              className="bg-gray-200"
              open={openEditDailog}
              handler={handleAlterEditDailog}
              animate={{
                mount: { scale: 1, y: 0, x: 0 },
                unmount: { scale: 0, y: 200, x: 400 },
              }}
            >
              <div className="flex justify-between items-center px-6 py-4">
                <h1 className="text-3xl font-bold text-indigo-500 font-lato text-center">
                  Edit Sub Service
                </h1>
                <button
                  onClick={handleAlterEditDailog}
                  title="Close"
                  className="hover:scale-125 transition-all duration-500 ease-in-out"
                >
                  <RxCross2 size={25} />
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 gap-4 overflow-auto">
                <Input
                  className="bg-white"
                  color="indigo"
                  label="Name"
                  value={subService.name}
                  onChange={(e) =>
                    setSubService({ ...subService, name: e.target.value })
                  }
                />
                <Input
                  className="bg-white"
                  color="indigo"
                  label="Price"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
                  }}
                  value={subService.price}
                  onChange={(e) =>
                    setSubService({ ...subService, price: e.target.value })
                  }
                />
                <Select
                  className="bg-white"
                  label="Status"
                  value={subService.status}
                  onChange={(e) => setSubService({ ...subService, status: e })}
                >
                  <Option className="text-teal-500" value="active">
                    Active
                  </Option>
                  <Option className="text-red-500" value="inActive">
                    InActive
                  </Option>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleAlterEditDailog}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  variant="gradient"
                  color="teal"
                  onClick={handleUpdateSubServiceDetails}
                >
                  <span>Update</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </DialogFooter>
        </Dialog>
        <Button
          onClick={deleteSubService}
          size="lg"
          fullWidth={true}
          variant="gradient"
          color="red"
          className="flex gap-1 items-center justify-center"
        >
          Delete <MdDelete size={20} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubServiceCard;
