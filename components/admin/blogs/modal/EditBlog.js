"use client";
import React, { useState, useEffect } from "react";
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
import dynamic from "next/dynamic";
import { FaMicroblog } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase";
import { toast } from "sonner";
import Heading from "../Heading";

const TextEditorDialog = dynamic(() => import("./TextEditor"), { ssr: false });

const EditBlog = ({ open, setOpen, blog, setBlogs }) => {
  const handleOpen = () => setOpen(!open);

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    content: "",
    description: "",
    image: null,
  });
  const [newImage, setNewImage] = useState(null);
  const [openTextEditor, setOpenTextEditor] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        type: blog.type || "",
        title: blog.title || "",
        description: blog.description || "",
        content: blog.content || "",
        image: blog.image || null,
      });
    }
  }, [blog]);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setNewImage(file);
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
      });
    } else {
      toast.error("Invalid file. Please select a valid image.");
    }
  };

  const handleUpdateBlog = async (e) => {
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
      }

      setPending(true);

      let imageObject = formData.image;

      if (newImage) {
        if (formData.image?.ref) {
          try {
            await deleteObject(ref(storage, formData.image.ref));
          } catch (err) {
            toast.error("Failed to delete the previous image");
          }
        }
        const imageRef = ref(storage, `blogs/${Date.now()}_${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        imageObject = { url: imageUrl, ref: imageRef._location.path_ };
      }

      const postData = {
        ...formData,
        image: imageObject,
      };

      const res = await fetch(`/api/admin/blog/${blog._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const updatedBlog = await res.json();
        toast.success(`Updated ${formData.title} blog`);
        handleOpen();
        setBlogs((prev) =>
          prev.map((b) => (b._id === blog._id ? updatedBlog : b))
        );
      } else {
        const errorData = await res.json();
        toast.error(`Error updating blog: ${errorData.message}`);
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      size="md"
      handler={handleOpen}
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
        title="Edit Blog"
        buttons={[
          <IconButton key={1} variant="text" onClick={handleOpen}>
            <RxCross1 size={20} color="teal" />
          </IconButton>,
        ]}
      />
      <form className="flex flex-col gap-5" onSubmit={handleUpdateBlog}>
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
          <div className="flex flex-col items-center">
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
          <div className="w-full h-56 text-center">
            <label
              htmlFor="blogImage"
              className="cursor-pointer flex items-center space-x-4 border border-gray-400 rounded-md p-4 w-full h-full"
            >
              {formData.image ? (
                <Image
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : formData.image.url
                  }
                  width={300}
                  height={224}
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
            {pending ? "Updating..." : "Update"}
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

export default EditBlog;
