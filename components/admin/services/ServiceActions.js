import React, { useEffect, useState } from "react";
import { MdEdit, MdMenu } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import {
  Button,
  Input,
  Dialog,
  Select,
  Option,
  DialogFooter,
  ButtonGroup,
  Textarea,
  Menu,
  MenuHandler,
  IconButton,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { IoIosAddCircleOutline, IoMdImages } from "react-icons/io";
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
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import location from "@/assets/location.json";
import { useRouter } from "next/navigation";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const ServiceActions = ({ id, updateService, setUpdateService }) => {
  const router = useRouter();
  const [imageUploaded, setImageUploaded] = useState(false);

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(!open2);
  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(!open3);
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

  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setSelectedCity] = useState("Patna");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Update cities whenever the selected state changes
    if (selectedState) {
      setCities(location[selectedState]);
      setSelectedCity(location[selectedState][0]);
    } else {
      setCities([]);
    }
  }, [selectedState]);
  const handleStateChange = (e) => {
    const state = e; // Check if e.target exists; if not, use e directly
    setSelectedState(state);
  };

  const handleCityChange = (e) => {
    const city = e;
    setSelectedCity(city);
  };

  const handleUpdateServiceDetails = async () => {
    try {
      setImageUploaded(true);
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateService),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setService(data.data);
      setUpdateService(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setImageUploaded(false);
    }
  };
  const handleUploadIcon = async (img) => {
    if (!img) {
      toast.error("Invalid icon");
      return;
    }
    const iconRef = ref(
      storage,
      `serviceIcons/${img.lastModified + img.size + img.name}`
    );
    await uploadBytes(iconRef, img);
    const iconUrl = await getDownloadURL(iconRef);
    const iconObject = { url: iconUrl, name: iconRef._location.path_ };
    setUpdateService({ ...updateService, icon: iconObject });
    setService({ ...service, icon: iconObject });
    const postData = { ...updateService, icon: iconObject };
    const response = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
      toast.error("Invalid icon / Gallery Image");
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
        const imageObject = {
          url: imageUrl,
          name: imageRef._location.path_,
        };
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
    <div className="flex gap-2">
      <ButtonGroup
        ripple={true}
        color="brown"
        variant="text"
        size="sm"
        className="hidden lg:flex"
      >
        <Button className="flex items-center gap-1" onClick={handleOpen2}>
          Edit details <MdEdit size={20} />
        </Button>
        <Button className="flex items-center gap-1" onClick={handleOpen3}>
          Change images <IoMdImages size={20} />
        </Button>
        <Button
          className="flex items-center gap-1 text-deep-orange-500"
          onClick={handleDeleteService}
        >
          Delete This Service <MdDelete size={20} />
        </Button>
      </ButtonGroup>
      <div className="block lg:hidden">
        <Menu placement="bottom-end">
          <MenuHandler>
            <IconButton variant="text">
              <HiOutlineMenuAlt3 size={25} className="text-gray-600" />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <MenuItem
              className="flex items-center gap-1 justify-end"
              onClick={handleOpen2}
            >
              Edit details <MdEdit size={18} />
            </MenuItem>
            <MenuItem
              className="flex items-center gap-1 justify-end"
              onClick={handleOpen3}
            >
              Change images <IoMdImages size={20} />
            </MenuItem>
            <MenuItem
              className="flex items-center gap-1 justify-end text-red-500"
              onClick={handleDeleteService}
            >
              Delete Service <MdDelete size={20} />
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <Dialog
        size="lg"
        className="bg-gray-200 px-2"
        open={open2}
        handler={handleOpen2}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <h1 className="text-3xl font-bold text-indigo-500 font-lato p-4 text-center">
          Edit Service
        </h1>
        <div className="p-4 grid grid-cols-1 gap-4 overflow-auto">
          <div className="flex gap-4 items-center flex-col lg:flex-row">
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
          <Textarea
            className="bg-white"
            label="Description"
            color="indigo"
            value={updateService.description}
            onChange={(e) =>
              setUpdateService({
                ...updateService,
                description: e.target.value,
              })
            }
          />
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="lg:w-10/12 w-full">
              <Select
                label="State"
                className="bg-white"
                name="state"
                color="indigo"
                value={selectedState}
                onChange={handleStateChange}
                required
              >
                {Object.keys(location).map((state) => (
                  <Option key={state} value={state}>
                    {state}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-4 flex-col md:flex-row w-full">
              <Select
                className="bg-white"
                label="City"
                name="city"
                color="indigo"
                value={selectedCity}
                onChange={handleCityChange}
                required
              >
                {cities.map((city) => (
                  <Option key={city} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
              <Button
                size="sm"
                onClick={() => {
                  if (updateService.cities.includes(selectedCity)) {
                    toast.error("City already selected");
                    return;
                  }
                  setUpdateService({
                    ...updateService,
                    cities: [...updateService.cities, selectedCity],
                  });
                }}
                color="purple"
                className="flex items-center justify-center gap-2 w-full lg:w-fit whitespace-nowrap"
              >
                <PlusIcon className="w-6 h-6" /> Add City
              </Button>
            </div>
          </div>
          <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Selected Cities
            </h2>
            <div className="flex flex-wrap gap-4">
              {updateService.cities.map((city, index) => (
                <div
                  key={index}
                  className="group flex items-center bg-white rounded-full pl-4 pr-2 py-2 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                >
                  <span className="text-gray-700 font-medium mr-2 text-sm">
                    {city}
                  </span>
                  <button
                    onClick={() => {
                      setUpdateService({
                        ...updateService,
                        cities: updateService.cities.filter((c) => c !== city),
                      });
                    }}
                    className="p-1 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors duration-300 ease-in-out"
                    aria-label={`Remove ${city}`}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {updateService.cities.length === 0 && (
              <p className="text-gray-500 mt-4">
                No cities selected. Add some cities to get started!
              </p>
            )}
          </div>
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
          Change Service Images
        </h1>
        <div className="p-4 grid grid-cols-1 gap-4 overflow-auto">
          <div>
            <h2 className="font-semibold text-gray-700 text-lg pb-2">
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
                  onChange={(e) => handleUploadIcon(e.target.files[0])}
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
                            handleReplaceServiceImage(e.target.files[0], image)
                          }
                        ></input>
                        <button
                          className="px-2 py-1 rounded bg-red-300 cursor-pointer flex gap-1 items-center justify-center"
                          onClick={() => handleDeleteServiceImage(image)}
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
  );
};

export default ServiceActions;
