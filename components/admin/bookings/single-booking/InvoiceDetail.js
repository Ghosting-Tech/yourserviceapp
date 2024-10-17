import { Button } from "@material-tailwind/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React from "react";
import { GoAlertFill } from "react-icons/go";

const InvoiceDetail = ({ booking }) => {
  const generatePDF = () => {
    const pdf = new jsPDF("portrait", "pt", "a4");

    // Set fonts and styles
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.text("Invoice", 40, 40);

    // Add header to the PDF with a slightly larger margin
    pdf.setFontSize(12);
    pdf.setTextColor(70, 70, 70); // Dark gray color for text
    pdf.text(`Company Name: Service Wallah`, 20, 80);
    pdf.text(`GTIN: 51651656wdw65`, 20, 100);
    pdf.text(`Recipient: ${booking.fullname}`, 20, 120);
    pdf.text(`Phone: ${booking.phoneNumber}`, 20, 140);
    pdf.text(`Booking ID: ${booking.bookingId}`, 20, 160);

    // Add a line to separate header
    pdf.setLineWidth(0.5);
    pdf.line(20, 170, 580, 170); // Extend the line across the page

    // Service Details Heading
    pdf.setFontSize(18);
    pdf.setTextColor(22, 160, 133); // Set the color to match the table header
    pdf.text("Service Details", 20, 190);

    // Add invoice details with improved spacing
    pdf.setFontSize(12);
    pdf.setTextColor(70, 70, 70); // Reset text color to dark gray
    pdf.text(`Title: ${booking.invoices.title}`, 40, 220);
    pdf.text(`Date: ${booking.invoices.date}`, 40, 240);
    pdf.text(`Time: ${booking.invoices.time}`, 40, 260);
    pdf.text(`Payment Method: ${booking.invoices.paymentMethod}`, 40, 280);
    pdf.text(`Transaction ID: ${booking.invoices.transactionId}`, 40, 300);
    pdf.text(`Status: ${booking.invoices.status}`, 40, 320);

    // Add a line before the table
    pdf.line(20, 340, 580, 340);

    // Add table headers and data
    autoTable(pdf, {
      startY: 350, // Starting position for the table
      head: [["Description", "Quantity", "Unit Price", "Amount"]],
      body: booking.invoices.items.map((item) => [
        item.description,
        item.quantity,
        `₹${item.unitPrice}`,
        `₹${item.amount}`,
      ]),
      theme: "striped", // Optional: you can customize the table style
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Header color and text color
      styles: { fontSize: 10, cellPadding: 5 }, // Increase padding for better spacing
      margin: { top: 20 }, // Add margin to the top of the table
    });

    // Add Total at the bottom with enhanced styling
    pdf.setFontSize(12);
    pdf.setTextColor(22, 160, 133); // Match the total color with the header
    pdf.text(
      `Total: ₹${booking.invoices.total}`,
      40,
      pdf.lastAutoTable.finalY + 40
    ); // Adjust position for clarity

    // Final touch: Add a footer with page number or additional notes if needed
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150); // Light gray color for footer
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      40,
      pdf.internal.pageSize.height - 30
    );

    // Save the generated PDF
    pdf.save("invoice.pdf");
  };

  return (
    <>
      {booking.invoices && (
        <div className="bg-white p-6 rounded-lg shadow w-full mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md md:text-xl font-semibold text-gray-800">
              Invoice Details
            </h3>

            <div className="flex gap-2 items-center">
              {booking.invoices.status === "Invoice Accepted" ? (
                <div className="bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs capitalize">
                  {booking.invoices.status}
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs capitalize">
                  {booking.invoices.status}
                </div>
              )}
              <Button color="blue" size="sm" onClick={generatePDF}>
                Download invoice
              </Button>
            </div>
          </div>

          {booking.invoices.transactionId == undefined ? (
            <div className="my-4 bg-red-50 text-red-500 text-sm p-4 rounded-lg flex gap-2 items-center">
              <GoAlertFill />
              No invoice payment has been made, Transaction not found.
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-gray-600">
                    Method: {booking.invoices.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">
                    Transaction ID: {booking.invoices.transactionId}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start flex-col lg:flex-row mb-2 gap-2">
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  Title:
                  <div className="text-gray-700 font-medium">
                    {booking.invoices?.title}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  Date & Time:
                  <div className="text-gray-700 font-medium">
                    {booking.invoices?.date}, {booking.invoices?.time}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  Total:
                  <div className="text-gray-700 font-medium">
                    ₹{booking.invoices?.total}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {booking.invoices.paid ? (
                  <div className="bg-teal-100 flex justify-center text-teal-800 rounded-full px-3 py-1 text-sm capitalize">
                    Paid
                  </div>
                ) : (
                  <div className="bg-red-100 flex justify-center text-red-800 rounded-full px-3 py-1 text-sm capitalize">
                    Not paid
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sm:bg-white rounded-lg border overflow-auto">
              {/* Header */}
              <div className="text-gray-900 bg-gray-300 flex flex-col sm:flex-row sm:rounded-none mb-2">
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">
                  Description
                </div>
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">
                  Quantity
                </div>
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">
                  Unit Price
                </div>
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">
                  Amount
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col bg-white">
                {booking.invoices?.items?.map((item, index) => (
                  <div
                    className="flex flex-col sm:flex-row mb-2 sm:mb-0 border-gray-300 border-b last:border-b-0"
                    key={index}
                  >
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      {item.description}
                    </div>
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      {item.quantity}
                    </div>
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      ₹{item.unitPrice}
                    </div>
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      ₹{item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceDetail;
