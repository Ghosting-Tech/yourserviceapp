"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import {
  ListItem,
  ListItemSuffix,
  Button,
  Input,
  Dialog,
  Select,
  Option,
  DialogFooter,
  Carousel,
  IconButton,
  ButtonGroup,
} from "@material-tailwind/react";
import {
  IoIosAddCircleOutline,
  IoMdAddCircle,
  IoMdImages,
} from "react-icons/io";
import { TiArrowRepeat } from "react-icons/ti";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import { storage } from "@/firebase";
import Image from "next/image";
import { toast } from "sonner";
import SubServiceCard from "@/components/admin/services/SubServiceCard";

const ServicePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState({
    bookings: [],
  });
  const [updateService, setUpdateService] = useState({
    bookings: [],
  });
  const [subServices, setSubServices] = useState([]);
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
      setUpdateService(data.service);
      setSubServices(data.service.subServices);
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

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  const formattedDate = formatDate(service.createdAt);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(!open2);
  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(!open3);

  const [serviceData, setServiceData] = useState({
    name: "",
    status: "",
    price: "",
    icon: {
      url: "",
      name: "",
    },
  });
  const [images, setImages] = useState(null);
  const [imageUploaded, setimageUploaded] = useState(false);

  const handleCreateSubService = async () => {
    try {
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
      if (!images) {
        toast.error("Upload the icon");
        return;
      }
      setimageUploaded(true);
      const iconRef = ref(
        storage,
        `subServiceIcons/${images.lastModified + images.size + images.name}`
      );
      await uploadBytes(iconRef, images);
      const iconUrl = await getDownloadURL(iconRef); // Get the image URL directly
      const iconObject = { url: iconUrl, name: iconRef._location.path_ };
      const postData = {
        ...serviceData,
        icon: iconObject,
        serviceId: id,
      };

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

      setSubServices(data.subServices);

      setimageUploaded(false);
      setServiceData({
        name: "",
        status: "",
        price: "",
        icon: {
          url: "",
          name: "",
        },
      });
      setImages(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async () => {
    try {
      // Ask for confirmation
      const confirmation = confirm(
        "Are you sure you want to delete this service?"
      );
      if (!confirmation) return;

      // Delete all images associated with the service if they exist
      if (updateService.images && updateService.images.length > 0) {
        await Promise.all(
          updateService.images.map(async (image) => {
            const imageRef = ref(storage, image.name);
            try {
              // Check if the image exists before deleting
              await getMetadata(imageRef);
              await deleteObject(imageRef);
              console.log(`Deleted image: ${image.name}`);
            } catch (err) {
              if (err.code === "storage/object-not-found") {
                console.log(
                  `Image ${image.name} not found, skipping deletion.`
                );
              } else {
                console.error(`Error deleting image: ${image.name}`, err);
              }
            }
          })
        );
      }

      // Delete the service icon if it exists
      if (updateService.icon) {
        const updateServiceIconRef = ref(storage, updateService.icon.name);
        try {
          // Check if the icon exists before deleting
          await getMetadata(updateServiceIconRef);
          await deleteObject(updateServiceIconRef);
          console.log("Deleted service icon");
        } catch (err) {
          if (err.code === "storage/object-not-found") {
            console.log("Service icon not found, skipping deletion.");
          } else {
            console.error("Error deleting service icon", err);
          }
        }
      }

      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
      }
      toast.success(data.message);
      router.back();
    } catch (err) {
      console.error("Error during service deletion", err);
    }
  };

  const handleUpdateServiceDetails = async () => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateService),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
      }
      toast.success(data.message);
      setService(data);
      setUpdateService(data);
      setSubServices(data.subServices);
      handleOpen2();
    } catch (err) {
      console.log(err);
    }
  };
  const handleUploadIcon = async (img) => {
    if (!img) {
      alert("Invalid icon");
      return;
    }
    await deleteObject(ref(storage, updateService.icon.name));
    const iconRef = ref(
      storage,
      `serviceIcons/${img.lastModified + img.size + img.name}`
    );
    await uploadBytes(iconRef, img);
    const iconUrl = await getDownloadURL(iconRef);
    const iconObject = { url: iconUrl, name: iconRef._location.path_ };
    setUpdateService({ ...updateService, icon: iconObject });
    setService({ ...service, icon: iconObject });
    const postData = {
      ...updateService,
      icon: iconObject,
    };
    const response = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();

    if (!data.success) {
      toast.error(data.message);
    }
    toast.success(data.message);
  };
  const handleUploadImages = async (imgs) => {
    if (!imgs) {
      alert("Invalid icon / Gallery Image");
      return;
    }
    const images = Object.values(imgs);
    const imagesUrlArray = await Promise.all(
      images.map(async (img) => {
        const imageRef = ref(
          storage,
          `serviceImages/${img.lastModified + img.size + img.name}`
        );
        await uploadBytes(imageRef, img);
        const imageUrl = await getDownloadURL(imageRef); // Get the image URL directly
        const imageObject = { url: imageUrl, name: imageRef._location.path_ };
        return imageObject;
      })
    );
    const postData = {
      ...updateService,
      images: [...updateService.images, ...imagesUrlArray],
    };
    setUpdateService(postData);
    setService(postData);

    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
    }
    toast.success(data.message);
  };
  const handleDeleteServiceImage = async (image) => {
    await deleteObject(ref(storage, image.name));
    setUpdateService({
      ...updateService,
      images: updateService.images.filter((e, i) => e.name !== image.name),
    });
    setService({
      ...service,
      images: service.images.filter((e, i) => e.name !== image.name),
    });
    const postData = {
      ...updateService,
      images: updateService.images.filter((e, i) => e.name !== image.name),
    };
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
    }
    toast.success(data.message);
  };
  const handleReplaceServiceImage = async (NewImage, oldImage) => {
    await deleteObject(ref(storage, oldImage.name));
    let postData = {
      ...updateService,
      images: updateService.images.filter((e, i) => e.name !== oldImage.name),
    };
    const imageRef = ref(
      storage,
      `serviceImages/${NewImage.lastModified + NewImage.size + NewImage.name}`
    );
    await uploadBytes(imageRef, NewImage);
    const imageUrl = await getDownloadURL(imageRef); // Get the image URL directly
    const imageObject = { url: imageUrl, name: imageRef._location.path_ };
    postData = {
      ...postData,
      images: [...postData.images, imageObject],
    };
    setUpdateService(postData);
    setService(postData);
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
    }
    toast.success(data.message);
  };

  return (
    <>
      {loading ? (
        <div className="grid place-items-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="loaction-loader"></div>
            <div className="text-2xl font-julius">Loading</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="px-4 md:px-20 my-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row justify-between">
              <button
                onClick={router.back}
                className="text-xl flex gap-1 items-center cursor-pointer text-gray-700"
                title="Go Back"
              >
                <FaArrowLeft />
                Service Details
              </button>
              <div className="flex gap-2">
                <ButtonGroup
                  ripple={true}
                  color="brown"
                  variant="text"
                  size="sm"
                >
                  <Button
                    className="flex items-center gap-1"
                    onClick={handleOpen2}
                  >
                    Edit details <MdEdit size={20} />
                  </Button>
                  <Button
                    className="flex items-center gap-1"
                    onClick={handleOpen3}
                  >
                    Change images <IoMdImages size={20} />
                  </Button>
                  <Button
                    className="flex items-center gap-1 text-deep-orange-500"
                    onClick={handleDeleteService}
                  >
                    Delete This Service <MdDelete size={20} />
                  </Button>
                </ButtonGroup>
                <Dialog
                  size="sm"
                  className="bg-gray-200 px-2"
                  open={open2}
                  handler={handleOpen2}
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                  }}
                >
                  <h1 className="text-3xl font-bold text-indigo-500 font-lato p-4 text-center">
                    Create New Service
                  </h1>
                  <div className="p-4 grid grid-cols-1 gap-4 overflow-auto">
                    <Input
                      className="bg-white"
                      color="indigo"
                      label="Name"
                      value={updateService.name}
                      onChange={(e) =>
                        setUpdateService({
                          ...updateService,
                          name: e.target.value,
                        })
                      }
                    />
                    <Select
                      className="bg-white"
                      label="Status"
                      value={updateService.status}
                      onChange={(e) =>
                        setUpdateService({ ...updateService, status: e })
                      }
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
                      onClick={handleOpen2}
                      className="mr-1"
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      variant="gradient"
                      color="teal"
                      loading={imageUploaded}
                      onClick={handleUpdateServiceDetails}
                    >
                      <span>Update</span>
                    </Button>
                  </DialogFooter>
                </Dialog>

                <Dialog
                  size="lg"
                  className="bg-gray-200"
                  open={open3}
                  handler={handleOpen3}
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                  }}
                >
                  <h1 className="text-3xl font-bold text-indigo-500 font-lato p-4 text-center">
                    Create New Service
                  </h1>
                  <div className="p-4 grid grid-cols-1 gap-4 overflow-auto">
                    <div>
                      <h2 className="text-center font-semibold text-gray-700 text-lg pb-2">
                        Service Icon
                      </h2>
                      <div className="flex justify-between items-center p-4 shadow-lg h-fit bg-white text-white rounded-md">
                        <Image
                          width={1000}
                          height={1000}
                          src={updateService.icon?.url}
                          alt=""
                          className="w-24 h-24 object-cover rounded drop-shadow-lg"
                        />
                        <div className="flex flex-col justify-between py-1 gap-1">
                          <label
                            htmlFor={"icon"}
                            className="px-2 py-1 rounded bg-indigo-300 cursor-pointer flex gap-1 items-center justify-center"
                          >
                            Replace <TiArrowRepeat />
                          </label>
                          <input
                            type="file"
                            id={"icon"}
                            onChange={(e) =>
                              handleUploadIcon(e.target.files[0])
                            }
                            className="hidden"
                          ></input>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center px-2">
                        <h2 className="text-center font-semibold text-gray-700 text-lg pb-2">
                          Gallery Images
                        </h2>
                        <label
                          htmlFor="new-gallery-img"
                          className="flex gap-1 cursor-pointer"
                        >
                          Add new <IoIosAddCircleOutline size={24} />
                        </label>
                        <input
                          onChange={(e) => handleUploadImages(e.target.files)}
                          type="file"
                          className="hidden"
                          id="new-gallery-img"
                          multiple
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 max-h-72 overflow-auto">
                        {updateService.images &&
                          updateService.images.map((image, index) => {
                            return (
                              <div
                                className="flex justify-between items-center p-4 shadow-lg h-fit bg-white text-white rounded-md"
                                key={index}
                              >
                                <Image
                                  width={100}
                                  height={100}
                                  src={image.url}
                                  alt=""
                                  className="w-24 h-24 object-cover rounded shadow-md"
                                />
                                <div className="flex flex-col justify-between py-1 gap-1">
                                  <label
                                    htmlFor={index}
                                    className="px-2 py-1 rounded bg-indigo-300 cursor-pointer flex gap-1 items-center justify-center"
                                  >
                                    Replace <TiArrowRepeat />
                                  </label>
                                  <input
                                    type="file"
                                    id={index}
                                    className="hidden"
                                    onChange={(e) =>
                                      handleReplaceServiceImage(
                                        e.target.files[0],
                                        image
                                      )
                                    }
                                  ></input>
                                  <button
                                    className="px-2 py-1 rounded bg-red-300 cursor-pointer flex gap-1 items-center justify-center"
                                    onClick={() =>
                                      handleDeleteServiceImage(image)
                                    }
                                  >
                                    Delete <MdDelete />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </Dialog>
              </div>
            </div>

            <div className="md:flex gap-4 justify-center md:justify-between">
              <div className="flex gap-4 items-center justify-center md:justify-start mb-5 md:mb-0 ">
                <Image
                  width={1000}
                  height={1000}
                  src={service.icon?.url}
                  alt=""
                  className="w-48 h-48 rounded-md object-cover drop-shadow-lg"
                />
                <div className="flex flex-col gap-2 justify-center">
                  <div>
                    <span
                      className={`border ${
                        service.status === "active"
                          ? "bg-teal-100"
                          : "bg-red-100"
                      }  text-xs ${
                        service.status === "active"
                          ? "text-teal-700"
                          : "text-red-700"
                      }  px-2 py-1 rounded-full`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <h1 className="font-bold text-5xl text-gray-700">
                    {service.name}
                  </h1>
                  <div className="text-sm">{formattedDate}</div>
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
                  {updateService.images?.map((image) => {
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
              <h1 className="text-3xl font-bold text-indigo-500 font-lato text-center">
                Sub Services
              </h1>
              <Button
                size="md"
                variant="gradient"
                color="indigo"
                className="flex gap-2 items-center"
                onClick={handleOpen}
              >
                Create Sub Service <IoMdAddCircle size={20} />
              </Button>
              <Dialog
                size="lg"
                open={open}
                handler={handleOpen}
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0.9, y: -100 },
                }}
              >
                <h1 className="text-3xl font-bold text-indigo-500 font-lato p-4 text-center">
                  Create New Sub Service
                </h1>
                <div className="p-4 grid grid-cols-2 gap-6 overflow-auto">
                  <Input
                    color="indigo"
                    label="Name"
                    onChange={(e) =>
                      setServiceData({ ...serviceData, name: e.target.value })
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
                    onChange={(e) =>
                      setServiceData({ ...serviceData, status: e })
                    }
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
                      onChange={(e) => setImages(e.target.files[0])}
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
            </div>
            <div className="h-px bg-gray-400 w-full"></div>

            <div className="flex justify-center md:justify-start flex-wrap gap-3 mx-auto md:mx-0">
              {subServices.map((sub, index) => {
                return (
                  <SubServiceCard
                    key={index}
                    sub={sub}
                    index={index}
                    serviceId={id}
                    subServices={subServices}
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
