"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import dynamic from "next/dynamic"; // Import dynamic
import { FaMicroblog } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
// import TextEditorDialog from "./TextEditor";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { toast } from "sonner";
import Heading from "../Heading";
import Image from "next/image";
const TextEditorDialog = dynamic(() => import("./TextEditor"), { ssr: false });

const CreateBlog = ({ open, setOpen, setBlogs }) => {
  const handleOpen = () => setOpen(!open);

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    content: "",
    image: null,
  });
  const [openTextEditor, setOpenTextEditor] = useState(false);
  const [pending, setPending] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: { preview: URL.createObjectURL(file), file: file },
      });
    } else {
      toast.error("Invalid file. Please select a valid image.");
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.type || !formData.description) {
        toast.warning("All fields are required");
        return;
      }
      if (!formData.content) {
        toast.warning(
          "Content is required, Please open Text editor to write the content"
        );
        return;
      }
      if (!formData.image) {
        toast.warning("Blog Image is required");
        return;
      }
      setPending(true);
      let imageObject = formData.image;

      if (formData.image.file) {
        const imageRef = ref(
          storage,
          `blogs/${Date.now()}_${formData.image.file.name}`
        );
        await uploadBytes(imageRef, formData.image.file);
        const imageUrl = await getDownloadURL(imageRef);
        imageObject = { url: imageUrl, ref: imageRef._location.path_ };
      }

      const postData = { ...formData, image: imageObject };

      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const responseData = await res.json();
        toast.success(`Created ${formData.title} blog`);
        handleOpen();
        setFormData({
          type: "",
          title: "",
          description: "",
          content: "",
          image: null,
        });
        setBlogs((prev) => {
          return [...prev, responseData];
        });
      } else {
        const errorData = await res.json();
        console.log({ Error: errorData });
        toast.error(`Error creating blog: ${errorData.message}`);
      }
    } catch (err) {
      console.log({ message: err });
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      size="md"
      animate={{
        mount: { scale: 1, x: 0 },
        unmount: { scale: 0, x: 600 },
      }}
      className="p-6 overflow-y-auto max-h-[80vh]"
    >
      <Heading
        icon={
          <div className="bg-teal-500 p-1 rounded-full inline-block">
            <FaMicroblog size={20} color="white" />
          </div>
        }
        title={"Create blog"}
        buttons={[
          <IconButton key={1} variant="text" onClick={handleOpen}>
            <RxCross1 size={20} color="teal" />
          </IconButton>,
        ]}
      />
      <form className="flex flex-col gap-5" onSubmit={handleCreateBlog}>
        <DialogBody className="flex flex-col gap-5">
          <Select
            label="Select Blog Type"
            color="teal"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
          >
            <Option value="Home Services">Home Services</Option>
            <Option value="Cleaning Services">Cleaning Services</Option>
            <Option value="Plumbing Services">Plumbing Services</Option>
            <Option value="Electrical Services">Electrical Services</Option>
            <Option value="Health and Wellness">Health and Wellness</Option>
            <Option value="Personal Care">Personal Care</Option>
            <Option value="Maintenance Services">Maintenance Services</Option>
            <Option value="Professional Services">Professional Services</Option>
            <Option value="Business Services">Business Services</Option>
            <Option value="Consulting Services">Consulting Services</Option>
          </Select>
          <Input
            label="Blog Title"
            color="teal"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              label="Description"
              rows={6}
              color="teal"
            />

            <Button
              fullWidth
              variant="gradient"
              color="teal"
              onClick={() => setOpenTextEditor(true)}
            >
              Open Text Editor
            </Button>
          </div>
          {/* Image upload box */}
          <div className="w-full h-56 text-center">
            <label
              htmlFor="blogImage"
              className="cursor-pointer flex items-center space-x-4 border border-gray-400 rounded-md p-4 w-full h-full"
            >
              {formData.image ? (
                <Image
                  src={formData.image.preview}
                  height={224}
                  width={300}
                  alt="Image"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex-grow pl-2">
                  <p className="text-gray-500">Upload Image</p>
                  <p className="text-sm text-gray-400">PNG or JPG</p>
                </div>
              )}
            </label>
            <input
              type="file"
              id="blogImage"
              name="blogImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </DialogBody>

        <DialogFooter className="py-0">
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            type="submit"
            className="py-2"
            disabled={pending}
          >
            {pending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
      <TextEditorDialog
        open={openTextEditor}
        setOpen={setOpenTextEditor}
        formData={formData}
        setFormData={setFormData}
      />
    </Dialog>
  );
};

export default CreateBlog;
