import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const ContactQuery = ({ booking }) => {
  return (
    <div className="flex gap-1 items-center mt-4">
      Contact for any query:{" "}
      <div className="flex gap-2">
        <Link
          target="_blank"
          href={`https://wa.me/${
            process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_NUMBER
          }/?text=${encodeURIComponent(
            `Hello, I have created a service on ${process.env.NEXT_PUBLIC_COMPANY_NAME}!,\nThis is my booking ID: ${booking.bookingId}.\nI am facing the issue:`
          )}`}
          className="flex items-center gap-2 text-xs px-3 py-1.5 bg-[#25D366] text-white rounded-md shadow-md hover:bg-[#20b358] transition-colors duration-200 cursor-pointer"
        >
          <FaWhatsapp className="text-lg" />
          <span className="font-semibold">WhatsApp</span>
        </Link>

        <Link
          target="_blank"
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL_ID}`}
          className="flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-700 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
        >
          <IoMail className="text-lg" />
          <span className="font-semibold">Mail Us</span>
        </Link>
      </div>
    </div>
  );
};

export default ContactQuery;
