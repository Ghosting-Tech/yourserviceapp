import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// JWT Secret (ensure this is stored in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// POST request to handle user login
export async function POST(request) {
  try {
    const { phoneNumber, password } = await request.json();

    // Connect to MongoDB
    await connectMongoDB();

    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });

    // If the user is not found, return a generic error message
    if (!user) {
      // Delay the response slightly to make brute force attacks harder
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { message: "Invalid credentials", status: 400 },
        { status: 400 }
      );
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password is incorrect, return a generic error message
    if (!isMatch) {
      // Delay the response slightly to make brute force attacks harder
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { message: "Invalid credentials", status: 400 },
        { status: 400 }
      );
    }

    // Check if the user account is active
    if (!user.active) {
      return NextResponse.json(
        { message: "Account is not active", status: 403 },
        { status: 403 }
      );
    }

    // Generate JWT token (excluding password and other sensitive data)
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" } // Set token expiration time
    );

    user.loginHistory.push({ eventType: "login" });
    user.lastVisit = new Date(); // Update lastVisit
    await user.save();

    // Set the token as an HTTP-only cookie, accessible on client and server side
    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );
    // Set cookie options (HttpOnly, Secure in production)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only on HTTPS
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 60 * 60 * 24 * 30, // 1 day expiration
      path: "/", // Make cookie accessible across the app
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong", status: 500 },
      { status: 500 }
    );
  }
}
