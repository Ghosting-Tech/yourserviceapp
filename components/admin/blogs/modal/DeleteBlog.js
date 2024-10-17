"use client";
import { storage } from "@/firebase";
import { Dialog, Button, IconButton } from "@material-tailwind/react";
import { deleteObject, ref } from "firebase/storage";
import Image from "next/image";
import { FaTshirt } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineError } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import Heading from "../Heading";

const DeleteBlog = ({ open, setOpen, deleteBlog, setBlogs }) => {
  const handleOpen = () => setOpen(!open);

  const handledeleteBlog = async () => {
    try {
      if (deleteBlog.image?.ref) {
        try {
          await deleteObject(ref(storage, deleteBlog.image.ref));
        } catch (error) {
          console.warn("Failed to delete image:", error);
        }
      }
      const res = await fetch(`/api/admin/blog/${deleteBlog._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Blog ${deleteBlog.title} deleted successfully!`);
        setBlogs((prev) => prev.filter((blog) => blog._id !== deleteBlog._id));
        handleOpen();
      } else {
        const errorData = await res.json();
        console.log(errorData);
        toast.error(`Failed to delete blog: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1 },
          unmount: { scale: 0 },
        }}
        className="p-6 flex flex-col gap-4"
      >
        <Heading
          icon={
            <div className="bg-teal-500 p-1 rounded-full inline-block">
              <MdDeleteOutline size={20} color="white" />
            </div>
          }
          title={"Blog details"}
          buttons={[
            <IconButton key={1} variant="text" onClick={handleOpen}>
              <RxCross1 size={20} color="teal" />
            </IconButton>,
          ]}
        />
        <div className="w-full h-full flex border p-4  bg-white rounded-xl">
          <Image
            src={deleteBlog.image?.url}
            alt="Image"
            width={150}
            height={250}
            className="w-40 h-40 rounded-md object-cover"
          />
          <div className="p-4 w-full flex flex-col">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-x lg:text-3xl font-bold text-pink-500">
                {deleteBlog.title}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-4 py-1 rounded-md">
          <MdOutlineError />
          <div>Are you sure you want to delete this Blog?</div>
        </div>
        <div className="flex justify-end items-center gap-4">
          <Button
            variant="outlined"
            size="sm"
            className="rounded"
            color="red"
            onClick={handleOpen}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="rounded"
            color="red"
            type="submit"
            onClick={handledeleteBlog}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteBlog;
