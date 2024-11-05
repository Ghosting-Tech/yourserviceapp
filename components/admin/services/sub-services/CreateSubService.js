import { storage } from "@/firebase";
import {
  Button,
  Dialog,
  DialogFooter,
  Input,
  Option,
  Select,
  Textarea,
} from "@material-tailwind/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { toast } from "sonner";

const CreateSubService = ({ id, setService }) => {
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    status: "",
    price: "",
    icon: {
      url: "",
      name: "",
    },
  });

  const handleCreateSubService = async () => {
    try {
      console.log("Service Data: ", serviceData);
      if (serviceData.name === "") {
        toast.error("All fields are required");
        return;
      }
      if (serviceData.status === "") {
        toast.error("All fields are required");
        return;
      }
      if (serviceData.price === "") {
        toast.error("All fields are required");
        return;
      }
      if (!image) {
        toast.error("Upload the icon");
        return;
      }
      console.log("All check passed");
      setImageUploaded(true);
      const iconRef = ref(
        storage,
        `subServiceIcons/${image.lastModified + image.size + image.name}`
      );
      console.log("icon ref: ", iconRef);
      await uploadBytes(iconRef, image);
      const iconUrl = await getDownloadURL(iconRef); // Get the image URL directly
      console.log("icon url: ", iconUrl);
      const iconObject = { url: iconUrl, name: iconRef._location.path_ };
      const postData = {
        ...serviceData,
        icon: iconObject,
        serviceId: id,
      };
      console.log(postData);

      const response = await fetch(
        `/api/sub-services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        },
        { cache: "no-store" }
      );
      const data = await response.json();

      setService((prev) => {
        return {
          ...prev,
          subServices: data.subServices,
        };
      });

      setServiceData({
        name: "",
        description: "",
        status: "",
        price: "",
        icon: {
          url: "",
          name: "",
        },
      });
      setImage(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setImageUploaded(false);
    }
  };
  return (
    <>
      <Button
        size="md"
        variant="gradient"
        color="indigo"
        className="flex gap-2 items-center lg:w-fit w-full justify-center"
        onClick={handleOpen}
      >
        Create Sub Service <IoMdAddCircle size={20} />
      </Button>
      <Dialog
        size="md"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <h1 className="text-3xl font-bold text-indigo-500 font-lato p-4 pb-0 px-6 text-center">
          Create New Sub Service
        </h1>
        <div className="p-4 pb-0 px-6 grid grid-cols-1 gap-6 overflow-auto">
          <Input
            color="indigo"
            label="Name"
            onChange={(e) =>
              setServiceData({ ...serviceData, name: e.target.value })
            }
          />
          <Textarea
            label="Description"
            color="indigo"
            onChange={(e) =>
              setServiceData({ ...serviceData, description: e.target.value })
            }
          />
          <Input
            color="teal"
            label="Price"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
            }}
            onChange={(e) =>
              setServiceData({ ...serviceData, price: e.target.value })
            }
          />
          <Select
            label="Status"
            color="indigo"
            size="md"
            onChange={(e) => setServiceData({ ...serviceData, status: e })}
          >
            <Option className="text-teal-500" value="active">
              Active
            </Option>
            <Option className="text-red-500" value="inactive">
              InActive
            </Option>
          </Select>
          <div className="flex items-center gap-2 cursor-pointer">
            <label htmlFor="icon">Icon</label>
            <input
              className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              id="icon"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleCreateSubService}
            variant="gradient"
            color="teal"
            loading={imageUploaded}
          >
            <span>Create</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CreateSubService;
