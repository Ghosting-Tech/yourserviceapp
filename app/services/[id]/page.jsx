"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { Drawer, Rating, Textarea } from "@material-tailwind/react";
import {
  Button,
  Carousel,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdChevronLeft, MdChevronRight, MdDelete } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Link from "next/link";
import { VscDebugContinue } from "react-icons/vsc";
import { IoBagRemove } from "react-icons/io5";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import GiveReview from "@/components/services/review/GiveReview";
import Review from "@/components/services/review/Review";
import Loading from "@/components/Loading";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-700 text-white rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <MdChevronRight className="w-6 h-6" />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-gray-700 text-white rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <MdChevronLeft className="w-6 h-6" />
    </div>
  );
};

const sliderSettings = {
  // dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        // dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Service = () => {
  const { id } = useParams();

  const [service, setService] = useState({});

  const [cartItems, setCartItems] = useState([]);
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const handleAddingCart = (subService) => {
    const existingItem = cartItems.find((item) => item._id === subService._id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item._id === subService._id // Use _id here
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...subService, quantity: 1 }]);
      localStorage.setItem(
        "cart",
        JSON.stringify([...cartItems, { ...subService, quantity: 1 }])
      );
      openDrawer();
    }
  };
  const removingCartItem = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems.filter((item) => item._id !== id))
    );
    if (cartItems.length == 1) closeDrawer();
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getService = async () => {
      try {
        const res = await fetch(`/api/services/${id}`, { cache: "no-store" });
        const data = await res.json();
        setService(data.service);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getService();
    setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
  }, [id]);

  const [rating, setRating] = useState(0);

  return (
    <>
      <div
        className={`grid place-items-center min-h-screen absolute w-full bg-white transition-all duration-700 top-0 ${
          loading ? "opacity-100" : "opacity-0"
        } ${loading ? "z-50" : "-z-50"}`}
      >
        <Loading />
      </div>
      <div
        className={`${
          loading ? "hidden" : "block"
        } transition-all duration-700`}
      >
        <Drawer
          open={open}
          onClose={closeDrawer}
          className="p-4 shadow-lg overflow-auto"
          dismiss={{ enabled: false }}
          overlay={false}
          size={420}
          placement="right"
        >
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              Cart Services
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => {
              return (
                <div key={item._id} className="flex items-center gap-2">
                  <Image
                    width={1000}
                    height={1000}
                    src={item.icon?.url} // Replace with actual path
                    alt="Service Icon"
                    className="w-28 h-28 object-cover rounded shadow"
                  />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl leading-tight text-gray-700 font-bold w-full">
                      {item.name}
                    </h2>
                    <Typography color="teal" variant="h5">
                      ₹{item.price}
                    </Typography>
                    <Button
                      onClick={() => removingCartItem(item._id)}
                      color="red"
                      variant="gradient"
                      size="sm"
                      className="rounded w-fit flex items-center gap-1"
                    >
                      Remove <IoBagRemove />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="lg"
              variant="outlined"
              className="rounded flex items-center gap-1"
              onClick={closeDrawer}
            >
              Continue Browsing <VscDebugContinue />
            </Button>
            <Link href={"/cart"}>
              <Button
                size="lg"
                color="gray"
                variant="gradient"
                className="rounded flex items-center gap-1"
              >
                Next <FaCartShopping />
              </Button>
            </Link>
          </div>
        </Drawer>
        <div className="px-4 md:px-20 my-6 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="w-full lg:w-2/3 p-4 flex flex-col justify-center gap-6 rounded-lg">
              <div className="flex items-center gap-2">
                {service.icon?.url ? (
                  <Image
                    width={100}
                    height={100}
                    src={service.icon.url}
                    alt="Service Icon"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span>Icon</span>{" "}
                    {/* Placeholder if no icon is available */}
                  </div>
                )}

                <div className="flex flex-col gap-2 justify-center">
                  <h2 className="lg:text-4xl md:text-5xl sm:text-5xl  text-4xl leading-tight text-gray-700 font-bold  ">
                    {service.name}
                  </h2>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }, (e, index) => {
                          let stars = rating;
                          return (
                            <span key={index} className="text-[#FFB800]">
                              {stars >= index + 1 ? (
                                <IoIosStar size={15} />
                              ) : stars >= index + 0.5 ? (
                                <IoIosStarHalf size={15} />
                              ) : (
                                <IoIosStarOutline size={15} />
                              )}
                            </span>
                          );
                        })}
                      </div>
                      <span className="ml-1">{rating}</span>
                    </div>
                    <span className="ml-2 text-gray-700">
                      | {service?.reviews?.length} reviews
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600  overflow-y-auto no-scrollbar  max-h-24 max-w-[450px]">
                {service.description}
              </p>
              <div className="flex gap-2 items-center  ">
                <div className="whitespace-nowrap text-sm">
                  Reviews & Bookings
                </div>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>
              <div className="flex items-start gap-6 ">
                <div className="flex flex-col w-full items-center gap-2 bg-white h-fit  shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-all">
                  <Image
                    width={100}
                    height={100}
                    src="/icons/cargo.png" // Replace with actual path
                    alt="Bookings Icon"
                    className="w-20 object-cover"
                  />
                  <span className="text-gray-600 text-xl">
                    {service?.bookings?.length} Bookings
                  </span>
                </div>
                <div className="flex flex-col w-full items-center gap-2 bg-white h-fit  shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-all">
                  <Image
                    width={100}
                    height={100}
                    src="/icons/star.png" // Replace with actual path
                    alt="Star Icon"
                    className="w-20 object-cover"
                  />
                  <span className="text-gray-600 text-xl">
                    {rating} | {service?.reviews?.length} reviews
                  </span>
                </div>
              </div>
            </div>

            <Carousel
              className="rounded-md w-full max-h-auto overflow-hidden"
              loop
              prevArrow={({ handlePrev }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handlePrev}
                  className="!absolute top-2/4 left-4 -translate-y-2/4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </IconButton>
              )}
              nextArrow={({ handleNext }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handleNext}
                  className="!absolute top-2/4 !right-4 -translate-y-2/4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </IconButton>
              )}
            >
              {service.images?.map((image) => (
                <Image
                  width={1000}
                  height={1000}
                  key={image.name}
                  src={image.url}
                  alt=""
                  className="h-96 w-full object-cover"
                />
              ))}
            </Carousel>
          </div>
          <div className="w-full flex flex-col justify-center items-center py-4 px-4">
            <h1 className="font-julius lg:text-5xl md:text-4xl sm:text-3xl text-3xl text-center text-gray-700 font-bold">
              {service.name}
            </h1>
          </div>
          <div className="container mx-auto">
            {service.subServices?.length <= 4 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center">
                {service.subServices?.map((subService, index) => (
                  <Card className="mb-3 max-w-72 overflow-hidden" key={index}>
                    <Image
                      width={100}
                      height={100}
                      src={subService.icon?.url}
                      alt="Service Icon"
                      className="object-cover w-64 aspect-square"
                    />
                    <div className="p-4">
                      <div className="flex flex-col justify-start gap-2">
                        <span
                          className={`border w-fit text-xs ${
                            subService.status === "active"
                              ? "bg-teal-100"
                              : "bg-red-100"
                          } text-xs ${
                            subService.status === "active"
                              ? "text-teal-700"
                              : "text-red-700"
                          } px-2 py-1 rounded-full`}
                        >
                          {subService.status}
                        </span>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {subService.name}
                        </Typography>
                      </div>
                      <div className="text-2xl font-bold text-teal-500">
                        ₹{subService.price}
                      </div>
                    </div>
                    <CardFooter className="pt-0 flex flex-col gap-2">
                      {cartItems.some((sub) => sub._id === subService._id) ? (
                        <Button
                          size="lg"
                          fullWidth
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
                          size="lg"
                          fullWidth
                          variant="gradient"
                          color="indigo"
                          className="flex gap-2 items-center justify-center"
                          onClick={() => handleAddingCart(subService)}
                        >
                          <span>Add to cart</span>
                          <FaCartArrowDown size={20} />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {service.subServices?.map((subService, index) => (
                  <div key={index} className="px-3">
                    <Card className="mb-3">
                      <CardHeader floated={false}>
                        <Image
                          width={100}
                          height={100}
                          src={subService.icon.url}
                          alt="Service Icon"
                          className="object-cover w-64 h-48 shadow-lg"
                        />
                      </CardHeader>
                      <CardBody>
                        <div className="mb-1 flex flex-col justify-start gap-2">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {subService.name}
                          </Typography>
                        </div>
                        <div className="text-2xl font-bold text-teal-500">
                          ₹{subService.price}
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0 flex flex-col gap-2">
                        {cartItems.some((sub) => sub._id === subService._id) ? (
                          <Button
                            size="lg"
                            fullWidth
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
                            size="lg"
                            fullWidth
                            variant="gradient"
                            color="indigo"
                            className="flex gap-2 items-center justify-center"
                            onClick={() => handleAddingCart(subService)}
                          >
                            <span>Add to cart</span>
                            <FaCartArrowDown size={20} />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
        <Review
          service={service}
          serviceId={id}
          rating={rating}
          setRating={setRating}
          setService={setService}
        />
      </div>
    </>
  );
};

export default Service;
