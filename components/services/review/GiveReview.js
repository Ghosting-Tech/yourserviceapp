"use client";

import { Textarea, Button, Rating } from "@material-tailwind/react";

export default function GiveReview({ handleReviewSubmit, review, setReview }) {
  return (
    <div className="px-8 py-6 bg-white rounded-md w-1/2 mx-auto">
      <h3 className="text-2xl text-blue-gray-500 font-semibold mb-4 text-center">
        Rate and Review
      </h3>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div className="flex gap-2 items-center">
          <label className="text-lg font-medium">Rating</label>
          <Rating
            unratedColor="amber"
            value={review.rating}
            onChange={(value) =>
              setReview((prev) => ({ ...prev, rating: value }))
            }
            required
          />
        </div>
        <Textarea
          label="Message"
          color="blue-gray"
          value={review.review}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, review: e.target.value }))
          }
          required
          rows="5"
        />
        <div className="flex justify-end">
          <Button type="submit" color="blue">
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}
