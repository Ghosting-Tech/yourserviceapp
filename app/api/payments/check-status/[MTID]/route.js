import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import formatDate from "@/utils/formatDate";
import shortUrl from "@/utils/shortUrl";
import axios from "axios";
import { NextResponse } from "next/server";
import sha256 from "sha256";

export async function GET(req, { params }) {
  const { MTID } = params;

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const invoice = searchParams.get("invoice");

  if (!MTID)
    return NextResponse.json("Transaction is not found!", { status: 400 });
  if (!bookingId)
    return NextResponse.json("Order id is required!", { status: 400 });

  const { PHONEPE_MERCHANT_ID, PHONEPE_BASE_URL, PHONEPE_SALT_KEY } =
    process.env;
  const saltIndex = 1;
  const checkEndPoint = "/pg/v1";

  const checksum =
    sha256(
      `${checkEndPoint}/status/${PHONEPE_MERCHANT_ID}/${MTID}` +
        PHONEPE_SALT_KEY
    ) +
    "###" +
    saltIndex;

  try {
    const options = {
      method: "GET",
      url: `${PHONEPE_BASE_URL}${checkEndPoint}/status/${PHONEPE_MERCHANT_ID}/${MTID}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${PHONEPE_MERCHANT_ID}`,
      },
    };

    const response = await axios.request(options);
    await connectMongoDB();

    if (response.data.success) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return NextResponse.json("Invalid booking id", { status: 500 });
      }

      if (invoice === "true") {
        await Booking.findByIdAndUpdate(
          bookingId,
          {
            $set: {
              status: "Invoice Paid!",
              "invoices.paid": true,
              "invoices.paymentMethod": "Online",
              "invoices.transactionId": MTID,
            },
          },
          { new: true }
        );

        const currentDate = formatDate();

        const message = `Hi ${
          booking.fullname
        }, We've received your Invoice payment of ₹ ${
          booking.invoices?.total || 0
        } for Booking ID: ${
          booking.bookingId
        }. processed on ${currentDate}. - GHOSTING WEBTECH PRIVATE LIMITED`;

        await fetch(`${process.env.PHONEPE_REDIRECT_URL}/api/send-sms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: booking.phoneNumber,
            message,
            templateid: "1707172967668368450",
          }),
        });
      } else {
        await Booking.findByIdAndUpdate(
          bookingId,
          {
            $set: {
              paid: true,
              transactionId: MTID,
              paymentMethod: "Online",
              status: "Request sended to service provider!",
            },
          },
          { new: true }
        );

        const amount = (
          booking.cartItems.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
          ) + 18
        ).toFixed(2);

        const cleanUrl = await shortUrl(
          `https://demo.yourserviceapp.in/user/bookings/${booking._id}`
        );

        const itemNames = booking.cartItems.map((item) => item.name).join(", ");
        const truncatedItemNames =
          itemNames.length > 30 ? `${itemNames.slice(0, 27)}...` : itemNames;

        const message = `Hi ${booking.fullname} We've received your payment of ₹ ${amount} for your booking of ${truncatedItemNames}. Your booking is confirmed. Track your booking here: ${cleanUrl}. - GHOSTING WEBTECH PRIVATE LIMITED`;

        await fetch(`${process.env.PHONEPE_REDIRECT_URL}/api/send-sms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: booking.phoneNumber,
            message,
            templateid: "1707172967865150658",
          }),
        });
      }
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error during checking payment status:", error);
    return NextResponse.json(
      { error: "Checking payment status failed", details: error.message },
      { status: 500 }
    );
  }
}
