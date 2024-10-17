// components/ServiceSection.js
import ServiceCard from "./ServiceCard";
import personIcon from "../public/image/service1.svg"; // Ensure this file is in the public folder
import personIcon2 from "../public/image/service2.svg"; // Ensure this file is in the public folder
import personIcon3 from "../public/image/service3.svg"; // Ensure this file is in the public folder
import medalIcon from "../public/image/service1model.svg"; // Ensure this file is in the public folder
import medalIcon2 from "../public/image/service2model.svg"; // Ensure this file is in the public folder
import medalIcon3 from "../public/image/service3model.svg";
import { WiStars } from "react-icons/wi";
import Image from "next/image";

const ServiceSection = () => {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center py-4 px-4">
        <h1 className="font-julius lg:text-5xl md:text-4xl sm:text-3xl text-3xl text-center flex text-gray-700 mb-2  ">
          <WiStars color="orange" />
          How to book a service
          <WiStars color="orange" />
        </h1>
        <Image
          width={100}
          height={100}
          className=" lg:w-96  md:w-96 sm:w-80 w-64"
          src="/image/line2.svg"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-6 items-center space-y-8 py-8 bg-gray-100 px-4 lg:px-20 pb-6 ">
        <ServiceCard
          title="Find the service"
          description="Choose from various amounts of services that fit your needs and expectations."
          buttonText="Book a Service »"
          url="/services"
          imageUrl={personIcon}
          medalIcon={medalIcon}
        />
        <ServiceCard
          title="Book a service"
          description="Book a service and wait for the service provider to come on your given location"
          imageUrl={personIcon2}
          medalIcon={medalIcon2}
        />
        <ServiceCard
          title="Just chill "
          description="Service Provider will come to your house and do his work, We check all the service provider before assisting you. So no need to worry."
          imageUrl={personIcon3}
          medalIcon={medalIcon3}
        />
      </div>
    </>
  );
};

export default ServiceSection;
