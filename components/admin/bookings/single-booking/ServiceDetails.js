import ShowPricing from "@/components/ShowPricing";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";
import { GoAlertFill } from "react-icons/go";
import { jsPDF } from "jspdf";

const ServiceDetails = ({ booking }) => {


  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Calculate subtotal and total
    const subtotal = booking.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const total = subtotal + 18; // Adding static convenience fee of ₹18

    const serviceData = {
      company: "Service Wallah",
      gtin: "1234567890123",
      BookingId: booking.bookingId,
      recipientName: booking.fullname,
      recipientPhone: `+91 ${booking.phoneNumber}`,
      serviceDetails: booking.cartItems, // cartItems is expected to be an array
      paymentInfo: {
        method: booking.paymentMethod,
        transactionId: booking.transactionId,
        status: `${booking.paid ? "Paid" : "Unpaid"}`,
      },
    };

    let yOffset = 10; // Initial vertical position for text

    // Add header to the PDF
    doc.setFont("helvetica", "bold");
    doc.text(`Company Name: ${serviceData.company}`, 10, yOffset);
    yOffset += 10; // Move down after text
    doc.text(`GTIN: ${serviceData.gtin}`, 10, yOffset);
    yOffset += 10; // Move down after text
    doc.text(`Recipient: ${serviceData.recipientName}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Phone: ${serviceData.recipientPhone}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Booking ID: ${serviceData.BookingId}`, 10, yOffset);

    // Add a line to separate header
    yOffset += 5;
    doc.setLineWidth(0.2);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    // Service Details Heading
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Service Details", 10, yOffset);

    yOffset += 10; // Space before listing services

    serviceData.serviceDetails.forEach((item, index) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Service ${index + 1}: ${item.name}`, 10, yOffset);

      yOffset += 10; // Space between service name and details

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Price: ₹${item.price}  Quantity: ${item.quantity}`,
        10,
        yOffset
      );
      yOffset += 5;
    });

    // Add a line to separate service details from payment info
    doc.setLineWidth(0.2);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    // Add summary section for Subtotal, Convenience Fee, and Total
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Convenience Fee: ₹18.00`, 10, yOffset);
    yOffset += 10;
    doc.text(`Total: ₹${total.toFixed(2)}`, 10, yOffset);

    // Add payment info
    yOffset += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Info", 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Method: ${serviceData.paymentInfo.method}`, 10, yOffset);
    yOffset += 10;
    doc.text(
      `Transaction ID: ${serviceData.paymentInfo.transactionId}`,
      10,
      yOffset
    );
    yOffset += 10;
    doc.text(`Status: ${serviceData.paymentInfo.status}`, 10, yOffset);

    // Save the PDF
    doc.save("service_invoice.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Service Details</h3>
        <Button color="blue" size="sm" onClick={handleDownloadPdf}>
          Download
        </Button>
      </div>
      {/* Cart Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {booking.cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center py-4 border-b"
          >
            <div className="flex items-center gap-4">
              <Image
                width={500}
                height={500}
                src={item.icon.url}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Qty: {item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing Info */}
      <ShowPricing cartItems={booking.cartItems} />

      {/* Payment Info */}
      {booking.transactionId == undefined ? (
        <div className="mt-6 bg-red-50 text-red-500 text-sm p-4 rounded-lg flex gap-2 items-center">
          <GoAlertFill />
          No payment has been made, Transaction not found.
        </div>
      ) : (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Payment Info
            </h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                booking.paid
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {booking.paid ? "Paid" : "Not Paid"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Method:</span>{" "}
                {booking.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Transaction ID:</span>{" "}
                {booking.transactionId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
