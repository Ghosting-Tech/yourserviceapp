import { IoLogoInstagram } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { MdWhatsapp } from "react-icons/md";
import { CiLinkedin } from "react-icons/ci";
import { RiFacebookBoxLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer
      className="bg-gray-100 border-t border-gray-300 text-black pt-6 pb-4"
      style={{
        backgroundImage: "url(/image/shape-3-2.png)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-4 md:px-14 flex justify-between flex-col md:flex-row ">
        {/* Company Description */}
        <div className="md:w-1/3 mb-6 lg:mb-0 px-4 w-full">
          <Image
            width={500}
            height={500}
            className="cursor-pointer w-56 object-cover mb-4"
            src="/logo/logo.svg"
            alt="Profile image"
          />{" "}
          <p className="mb-4">
            We&apos;re a leading agency specializing in providing customized service
            solutions for businesses of all sizes.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              support@yourserviceapp.in
            </li>
            <li className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              +91 9470017395
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:w-1/3 mx-auto w-full px-4 md:px-0">
          <h3 className="text-xl font-bold mb-4">Important Links</h3>
          <ul className="flex flex-col gap-2 justify-center">
            <Link href={`/about`} className="hover:underline">
              About Us
            </Link>
            <Link href={`/services`} className="hover:underline">
              Services
            </Link>
            <Link href={`/privacy-policy`} className="hover:underline">
              Privacy Policy
            </Link>
            <Link href={`/refund-policy`} className="hover:underline">
              Refund Policy
            </Link>
            <Link href={`/terms-and-condition`} className="hover:underline">
              Terms and Conditions
            </Link>
          </ul>
        </div>

        <div className="flex gap-2 flex-row mt-4 md:flex-col justify-center md:justify-start text-gray-700">
          <Link
            target="_blank"
            href={`https://facebook.com`}
            className="hover:scale-110 transition-all text-blue-500"
          >
            <RiFacebookBoxLine className="w-6 h-6" />
          </Link>
          <Link
            target="_blank"
            href={`https://facebook.com`}
            className="hover:scale-110 transition-all text-pink-500"
          >
            <IoLogoInstagram className="w-6 h-6" />
          </Link>
          <Link
            target="_blank"
            href={`https://facebook.com`}
            className="hover:scale-110 transition-all text-indigo-500"
          >
            <CiLinkedin className="w-6 h-6" />
          </Link>
          <Link
            target="_blank"
            href={`https://facebook.com`}
            className="hover:scale-110 transition-all text-teal-500"
          >
            <MdWhatsapp className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-300 text-center text-sm pt-4 mt-4">
        <p>© Service Wallah. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
