import React from "react";

const ShowPricing = ({ cartItems }) => {
  return (
    <div className="mt-6">
      {/* Subtotal */}
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold">
          ₹
          {cartItems
            ? new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
                .format(
                  cartItems.reduce(
                    (acc, cur) => acc + cur.price * cur.quantity,
                    0
                  )
                )
                .replace("₹", "")
                .trim()
            : "0.00"}
        </span>
      </div>

      {/* Convenience Fee */}
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Convenience Fee</span>
        <span className="font-semibold">₹18.00</span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-t border-gray-300 mt-4">
        <span className="text-lg font-bold">Total</span>
        <span className="text-lg font-bold">
          ₹
          {cartItems
            ? new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
                .format(
                  cartItems.reduce(
                    (acc, cur) => acc + cur.price * cur.quantity,
                    18
                  )
                )
                .replace("₹", "")
                .trim()
            : "0.00"}
        </span>
      </div>
    </div>
  );
};

export default ShowPricing;
