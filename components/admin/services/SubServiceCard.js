"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { storage } from "@/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Option,
  Select,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import { IoMdOpen } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoBagRemove } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { TiArrowRepeat } from "react-icons/ti";
import Link from "next/link";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { FaArrowRightLong } from "react-icons/fa6";

export default function SubServiceCard({
  forAdmin,
  cartItems,
  removingCartItem,
  handleAddingCart,
  sub,
  index,
  subServices,
  fetchingInitialData,
}) {
  const [subService, setSubService] = useState(sub);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleViewDialog = () => setViewDialogOpen(!viewDialogOpen);
  const handleEditDialog = () => setEditDialogOpen(!editDialogOpen);

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

      try {
        await getMetadata(imageRef);
        await deleteObject(imageRef);
      } catch (err) {
        if (err.code === "storage/object-not-found") {
          console.log("Image not found, skipping deletion");
        } else {
          throw err;
        }
      }

      const res = await fetch(`/api/sub-services`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
      console.error("Error deleting sub-service:", error);
      toast.error("Failed to delete sub-service");
    }
  };

  const handleReplaceIcon = async (image) => {
    try {
      if (!image) return;
      try {
        await deleteObject(ref(storage, subService.icon.name));
      } catch (error) {
        console.error("Error deleting previous image:", error);
      }
      const iconRef = ref(
        storage,
        `subServiceIcons/${Date.now()}-${image.name}`
      );
      await uploadBytes(iconRef, image);
      const iconUrl = await getDownloadURL(iconRef);
      const iconObject = { url: iconUrl, name: iconRef.fullPath };
      const updatedSubService = { ...subService, icon: iconObject };
      setSubService(updatedSubService);
      await updateSubService(updatedSubService);
      setViewDialogOpen(false);
    } catch (error) {
      console.error("Error replacing icon:", error);
      toast.error("Failed to replace icon");
    }
  };

  const updateSubService = async (updatedSubService) => {
    try {
      const res = await fetch(`/api/sub-services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSubService),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Sub service updated successfully");
        setEditDialogOpen(false);
        fetchingInitialData();
      }
    } catch (error) {
      console.error("Error updating sub-service:", error);
      toast.error("Failed to update sub-service");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      key={index}
      className="group hover:scale-110 transition-all relative bg-white dark:bg-gray-800 rounded-2xl w-72 shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-48 overflow-hidden bg-white">
        <Image
          src={subService.icon.url}
          alt={subService.name}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-300 group-hover:opacity-90 group-hover:scale-110 group-hover:rotate-2"
        />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
            subService.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {subService.status}
        </motion.div>
      </div>

      <div className="p-6 space-y-1">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
          {subService.name}
        </h3>
        <div className="text-gray-500 truncate text-sm">
          {subService?.description?.length > 100
            ? `${subService.description.substring(0, 97)}...`
            : subService?.description}
          {!subService?.description && (
            <span className="text-gray-500" onClick={() => handleViewDialog()}>
              ...
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ₹{subService.price}
        </div>
        {forAdmin ? (
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={deleteSubService}
              variant="text"
              color="red"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <MdDelete className="h-4 w-4" />
              Delete
            </Button>
            <Button
              onClick={handleViewDialog}
              variant="gradient"
              color="blue"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <IoMdOpen className="h-4 w-4" />
              View
            </Button>
          </div>
        ) : (
          <div className="pt-0 flex gap-4 w-full">
            <IconButton
              onClick={handleViewDialog}
              variant="text"
              fullWidth
              color="blue"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <IoMdOpen className="h-4 w-4" />
            </IconButton>
            {cartItems.some((sub) => sub._id === subService._id) ? (
              <Button
                size="sm"
                variant="gradient"
                color="red"
                className="flex gap-2 items-center justify-center"
                onClick={() => removingCartItem(subService._id)}
              >
                <span>Remove Service</span>
                <IoBagRemove size={20} />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="gradient"
                color="blue"
                className="flex gap-2 items-center justify-center"
                onClick={() => handleAddingCart(subService)}
              >
                <span>Select service</span>
                <FaCartArrowDown size={20} />
              </Button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewDialogOpen && (
          <Dialog
            size="lg"
            open={viewDialogOpen}
            handler={handleViewDialog}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
            className="bg-white dark:bg-gray-800"
          >
            <DialogHeader className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-gray-100">
                Sub Service Details
              </h3>
              <Button
                variant="text"
                color="blue-gray"
                onClick={handleViewDialog}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RxCross2 size={24} />
              </Button>
            </DialogHeader>
            <DialogBody className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={subService.icon.url}
                      alt={subService.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  {forAdmin && (
                    <div className="mt-4 flex justify-center">
                      <label className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-2">
                        <TiArrowRepeat size={20} />
                        Replace Icon
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files &&
                            handleReplaceIcon(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      {subService.name}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        subService.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subService.status}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{subService.price}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed">
                    {subService.description}
                  </p>
                  {!forAdmin &&
                    (cartItems.some((sub) => sub._id === subService._id) ? (
                      <Link href={"/cart"}>
                        <Button
                          size="sm"
                          variant="outlined"
                          color="blue"
                          className="flex gap-2 items-center justify-center"
                        >
                          <span>Next</span>
                          <FaArrowRightLong />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="gradient"
                        color="blue"
                        className="flex gap-2 items-center justify-center"
                        onClick={() => handleAddingCart(subService)}
                      >
                        <span>Add service</span>
                        <FaCartArrowDown size={20} />
                      </Button>
                    ))}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    {forAdmin && (
                      <div className="flex gap-4">
                        <Button
                          variant="text"
                          color="red"
                          onClick={deleteSubService}
                          className="flex items-center gap-2"
                        >
                          <MdDelete size={20} />
                          Delete
                        </Button>
                        <Button
                          variant="gradient"
                          color="blue"
                          onClick={handleEditDialog}
                          className="flex items-center gap-2"
                        >
                          <MdEdit size={20} />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogBody>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editDialogOpen && (
          <Dialog
            size="sm"
            open={editDialogOpen}
            handler={handleEditDialog}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
          >
            <DialogHeader className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Edit Sub Service
              </h3>
              <Button
                variant="text"
                color="blue-gray"
                onClick={handleEditDialog}
              >
                <RxCross2 size={24} />
              </Button>
            </DialogHeader>
            <DialogBody divider>
              <form className="grid gap-4">
                <Input
                  label="Name"
                  value={subService.name}
                  onChange={(e) =>
                    setSubService({ ...subService, name: e.target.value })
                  }
                />
                <Input
                  label="Price"
                  value={subService.price}
                  onChange={(e) =>
                    setSubService({
                      ...subService,
                      price: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
                <Textarea
                  label="Description"
                  value={subService.description}
                  onChange={(e) =>
                    setSubService({
                      ...subService,
                      description: e.target.value,
                    })
                  }
                />
                <Select
                  label="Status"
                  value={subService.status}
                  onChange={(value) =>
                    value && setSubService({ ...subService, status: value })
                  }
                >
                  <Option value="active">Active</Option>
                  <Option value="inActive">Inactive</Option>
                </Select>
              </form>
            </DialogBody>
            <DialogFooter className="space-x-2">
              <Button variant="outlined" color="red" onClick={handleEditDialog}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => updateSubService(subService)}
              >
                Update
              </Button>
            </DialogFooter>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
