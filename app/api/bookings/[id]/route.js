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

  //Sending SMS to the user after creating the Invoices
  console.log(updatedBooking);
  const mobile = updatedBooking.phoneNumber;
  const name = updatedBooking.fullname;
  const title = updatedBooking.invoices.title;
  const bookingId = updatedBooking.bookingId;
  const url = await shortUrl(
    `${process.env.PRODUCTION_URL}/user/bookings/${id}`
  );
  console.log(mobile, name, title, id, url);
  const message = `Dear ${name}, an invoice has been generated for your recent ${title} (ID: ${bookingId}) by your service provider. Please review and make payment at your convenience. Track your booking here: ${url}. -GHOSTING WEBTECH PRIVATE LIMITED`;

  try {
    await fetch(`${process.env.PHONEPE_REDIRECT_URL}/api/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: mobile,
        message,
        templateid: "1707173018366282421",
      }),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while sending the sms" },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedBooking, { status: 201 });
}
