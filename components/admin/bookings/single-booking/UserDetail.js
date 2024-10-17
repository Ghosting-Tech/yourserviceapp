"use client";
import { IconButton, Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const UserDetail = ({ profileImage, name, phoneNumber, email }) => {
  return (
    <div className="flex items-start sm:items-center gap-2">
      {/* Profile Image */}
      {profileImage?.url ? (
        <Image
          width={500}
          height={500}
          src={profileImage.url}
          alt={name}
          className="w-16 h-16 rounded-full object-cover cursor-pointer"
        />
      ) : (
        <div className="w-16 h-16 rounded-full flex justify-center items-center font-junge bg-gray-400 cursor-pointer">
          {name && Array.from(name)[0].toUpperCase()}
        </div>
      )}

      {/* User Info */}
      <div className="flex flex-col text-gray-700">
        {/* Full Name */}
        <span className="text-md">{name}</span>

        <div className="flex gap-1 items-center">
          <Tooltip
            content={phoneNumber}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
          >
            <Link href={`tel:+91${phoneNumber}`} target="_blank">
              <IconButton variant="text">
                <FaPhoneAlt className="text-teal-500 text-xl cursor-pointer" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip
            content={phoneNumber}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
          >
            <Link href={`https://wa.me/${phoneNumber}`} target="_blank">
              <IconButton variant="text">
                <BsWhatsapp color="green" className="text-xl" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip
            content={email}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
          >
            <Link href={`mailto:${email}`} target="_blank">
              <IconButton variant="text">
                <FaEnvelope className="text-blue-700 text-xl cursor-pointer" />
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
