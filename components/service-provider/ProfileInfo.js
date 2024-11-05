import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Dialog,
} from "@material-tailwind/react";

const ProfileInfo = ({ user }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  return (
    <div className="flex flex-col shadow-lg gap-6 w-full h-full bg-white rounded-md px-6 py-4">
      <div className="flex justify-between w-full">
        <div>Phone Number</div>
        <div>{user?.phoneNumber}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>Email</div>
        <div>{user?.email}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>Gender</div>
        <div>{user?.gender}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>City</div>
        <div>{user?.city}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>State</div>
        <div>{user?.state}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>Account Created on</div>
        <div>{formatDate(user?.createdAt)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader
            floated={false}
            className="relative h-48"
            onClick={() => handleOpen(user?.id1?.image?.url)}
          >
            <img
              src={user?.id1?.image?.url}
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="p" color="blue-gray">
              {user?.id1?.name}
            </Typography>
          </CardBody>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader
            floated={false}
            className="relative h-48"
            onClick={() => handleOpen(user?.id2?.image?.url)}
          >
            <img
              src={user?.id2?.image?.url}
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="p" color="blue-gray">
              {user?.id2?.name}{" "}
            </Typography>
          </CardBody>
        </Card>
      </div>

      <Dialog
        size="xl"
        open={open}
        handler={() => setOpen(false)}
        className="bg-transparent shadow-none"
      >
        <div className="relative h-[90vh] w-full">
          <img
            src={selectedImage}
            alt="Full size preview"
            className="h-full w-full object-contain rounded-lg"
          />
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileInfo;
