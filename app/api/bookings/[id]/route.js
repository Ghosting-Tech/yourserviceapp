import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import shortUrl from "@/utils/shortUrl";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  //   console.log(id);
  await connectMongoDB();
  const booking = await Booking.findById(id).populate(
    "availableServiceProviders"
  );
  if (!booking) {
    return NextResponse.status(404).json({
      success: false,
      message: "Booking not found",
    }); // 404 Not Found status code
  }
  return NextResponse.json(
    {
      success: true,
      message: "Booking found",
      booking,
    },
    { status: 201 }
  );
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  await connectMongoDB();
  const updatedBooking = await Booking.findByIdAndUpdate(id, data, {
    new: true,
  });

  const mobile = updatedBooking.phoneNumber;
  const name = updatedBooking.fullname;
  const bookingId = updatedBooking.bookingId;
  const itemNames = updatedBooking.cartItems
    .map((item) => item.name)
    .join(", ");
  const truncatedItemNames =
    itemNames.length > 30 ? `${itemNames.slice(0, 27)}...` : itemNames;
  let url = await shortUrl(`${process.env.PRODUCTION_URL}/user/bookings/${id}`);
  let message, templateid;
  if (data.actionType === "otpVerification") {
    message = `Hi ${name} your service provider has arrived at your location for ${truncatedItemNames} (ID:${bookingId}). Please Track your booking here: ${url}. Thank you for choosing us! -GHOSTING WEBTECH PRIVATE LIMITED`;
    templateid = "1707173018310464476";
  } else if (data.actionType === "invoiceCreation") {
    message = `Dear ${name}, an invoice has been generated for your recent ${truncatedItemNames} (ID: ${bookingId}) by your service provider. Please review and make payment at your convenience. Track your booking here: ${url}. -GHOSTING WEBTECH PRIVATE LIMITED`;
    templateid = "1707173018366282421";
  }

  if (message && templateid) {
    try {
      await fetch(`${process.env.PHONEPE_REDIRECT_URL}/api/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: mobile,
          message,
          templateid,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json(
        { error: "An error occurred while sending the SMS" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(updatedBooking, { status: 201 });
}
