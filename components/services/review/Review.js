import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import GiveReview from "./GiveReview";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Rating } from "@material-tailwind/react";
import Image from "next/image";

const ReviewCard = ({ name, review, rating, image }) => (
  <div className="bg-white p-4 rounded-xl flex space-x-4">
    <div className="w-14 h-14">
      {image?.url ? (
        <Image
          width={100}
          height={100}
          src={image?.url}
          alt={name}
          className="rounded-full w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full text-xl text-black bg-gray-400 rounded-full flex justify-center items-center">
          {name && name[0].toUpperCase()}
        </div>
      )}
    </div>

    {/* Review Content */}
    <div className="flex-1">
      <div className="flex flex-col">
        {/* Stars */}
        <div className="flex mb-1">
          {Array.from({ length: 5 }, (e, index) => (
            <span key={index} className="text-amber-500">
              {rating >= index + 1 ? (
                <IoIosStar size={16} />
              ) : rating >= index + 0.5 ? (
                <IoIosStarHalf size={16} />
              ) : (
                <IoIosStarOutline size={16} />
              )}
            </span>
          ))}
        </div>
        <h3 className="text-lgs font-medium">{name}</h3>
      </div>
      {/* Review Text */}
      <p className="text-gray-600 mt-2 break-words whitespace-normal text-sm">
        {review}
      </p>
    </div>
  </div>
);

export default function Review({ service, id, rating, setRating, setService }) {
  const user = useSelector((state) => state.user.user);

  const [review, setReview] = useState({
    name: "",
    image: {
      url: "",
      name: "",
    },
    review: "",
    rating: 0,
  });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user.name) {
        toast.error("Please login to give a review");
        return;
      }
      if (user.role !== "user") {
        toast.error("Only users can give a review");
        return;
      }
      const updatedReview = {
        ...review,
        name: user.name,
        image: user.image,
      };
      const updatedService = {
        ...service,
        reviews: [...service.reviews, updatedReview],
      };
      const res = await axios.put(`/api/services/${id}`, updatedService);
      if (res.data.success) {
        setService(res.data.data);
        setReview({
          image: {
            url: "",
            name: "",
          },
          name: "",
          review: "",
          rating: 0,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [ratingArray, setRatingArray] = useState([]);

  useEffect(() => {
    if (service?.reviews?.length) {
      setRatingArray(service.reviews.map((review) => review.rating));
    }
  }, [service]);

  useEffect(() => {
    if (ratingArray.length > 0) {
      const countRatings = ratingArray.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      const {
        1: r1 = 0,
        2: r2 = 0,
        3: r3 = 0,
        4: r4 = 0,
        5: r5 = 0,
      } = countRatings;
      const totalRatings = r5 + r4 + r3 + r2 + r1;

      if (totalRatings > 0) {
        const result =
          (5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + 1 * r1) / totalRatings;
        setRating(parseFloat(result.toFixed(1))); // Ensure rating is a number
      } else {
        setRating(0);
      }
    } else {
      setRating(0);
    }
    //eslint-disable-next-line
  }, [ratingArray]);

  return (
    <div className="container mx-auto py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">All Reviews</h2>
        <div className="flex items-center">
          <div className="flex">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className="text-[#FFB800]">
                {rating >= index + 1 ? (
                  <IoIosStar size={15} />
                ) : rating >= index + 0.5 ? (
                  <IoIosStarHalf size={15} />
                ) : (
                  <IoIosStarOutline size={15} />
                )}
              </span>
            ))}
          </div>
          <span className="ml-1">{rating.toFixed(1)}</span>
          <span className="ml-2 text-gray-700">
            | {service?.reviews?.length || 0} reviews
          </span>
        </div>
      </div>

      <div className="flex flex-wrap h-full">
        {service?.reviews?.length === 0 ? (
          <div className="w-full h-full flex gap-2 flex-col justify-center items-center">
            <div className="text-2xl">Uh oh, There is no review yet.</div>
            <div className="text-gray-700">Be the first to leave a review!</div>
          </div>
        ) : (
          <div className="w-full overflow-auto max-h-screen grid lg:grid-cols-3 md:grid-cols-1 gap-4">
            {service.reviews?.map((review, index) => {
              return (
                <ReviewCard
                  key={index}
                  name={review.name}
                  image={review.image}
                  review={review.review}
                  rating={review.rating}
                />
              );
            })}
          </div>
        )}
      </div>

      <GiveReview
        handleReviewSubmit={handleReviewSubmit}
        review={review}
        setReview={setReview}
      />
    </div>
  );
}
