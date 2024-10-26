import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url } = await req.json();

    const urlRes = await axios.get(
      `https://ulvis.net/api.php?url=${url}&private=1`
    );

    const shortenedUrl = urlRes.data;
    const cleanUrl = shortenedUrl.replace(/^https?:\/\//, ""); // Removes 'https://' or 'http://'

    return NextResponse.json(
      { success: true, message: "Successfully sent the SMS.", url: cleanUrl },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error on sending SMS.", error: error },
      { status: 500 }
    );
  }
}
