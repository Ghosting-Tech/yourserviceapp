import axios from "axios";
import { NextResponse } from "next/server";
import sha256 from "sha256";

export async function POST(req) {
  const { amount, bookingId, userId, userPhoneNumber, invoice } = await req.json();
  const {
    PHONEPE_MERCHANT_ID,
    PHONEPE_BASE_URL,
    PHONEPE_REDIRECT_URL,
    PHONEPE_SALT_KEY,
  } = process.env;
  const payEndPoint = "/pg/v1/pay";
  const saltIndex = 1;

  // console.log({ amount, bookingId, userId, userPhoneNumber });
  // console.log({
  //   PHONEPE_MERCHANT_ID,
  //   PHONEPE_BASE_URL,
  //   PHONEPE_REDIRECT_URL,
  //   PHONEPE_SALT_KEY,
  // });

  if (!amount)
    return NextResponse.json({ error: "Amount is required" }, { status: 400 });
  if (!userId)
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  if (!userPhoneNumber)
    return NextResponse.json(
      { error: "User phone number is required" },
      { status: 400 }
    );
  if (!bookingId)
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );

  const timestamp = Date.now().toString();
  let merchantTransactionId = `MT${timestamp}`;

  merchantTransactionId = merchantTransactionId.replace(/[^a-zA-Z0-9_-]/g, "");

  if (merchantTransactionId.length > 34) {
    merchantTransactionId = merchantTransactionId.substring(0, 34);
  }
  // Create payload
  const payload = {
    merchantId: PHONEPE_MERCHANT_ID,
    merchantTransactionId, // Unique transaction ID
    merchantUserId: userId,
    amount: amount * 100, // Convert to smallest currency unit
    redirectUrl: `${PHONEPE_REDIRECT_URL}/status/${merchantTransactionId}?bookingId=${bookingId}&invoice=${invoice}`,
    callbackUrl: `${PHONEPE_REDIRECT_URL}/status/${merchantTransactionId}?bookingId=${bookingId}&invoice=${invoice}`,
    redirectMode: "REDIRECT",
    mobileNumber: `${userPhoneNumber}`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  // Encode payload to Base64
  const jsonString = JSON.stringify(payload);
  const base64EncodedPayload = Buffer.from(jsonString).toString("base64");

  // Generate checksum
  const checksum =
    sha256(base64EncodedPayload + payEndPoint + PHONEPE_SALT_KEY) +
    "###" +
    saltIndex;

  try {
    // Set request options for axios
    const options = {
      method: "POST",
      url: `${PHONEPE_BASE_URL}${payEndPoint}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: { request: base64EncodedPayload },
    };

    const response = await axios.request(options);
    // console.log(response.data)

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error during payment initiation:", error);
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
