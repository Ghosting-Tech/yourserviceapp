import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import jwtVerify from jose

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Convert the secret to a Uint8Array to be used by jose
const secret = new TextEncoder().encode(JWT_SECRET);

// List of protected routes based on roles
const protectedRoutes = {
  admin: ["/admin"], // Routes only accessible to admins
  serviceProvider: ["/service-provider"], // Routes only accessible to service providers
  user: ["/user"], // Routes only accessible to users
};
export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to the home route
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify the JWT token using jose
    const { payload } = await jwtVerify(token, secret);
    const { role } = payload;
    const currentPath = request.nextUrl.pathname;

    // Check access based on role
    if (role === "admin") {
      if (!protectedRoutes.admin.some((path) => currentPath.startsWith(path))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } else if (role === "service-provider") {
      if (
        !protectedRoutes.serviceProvider.some((path) =>
          currentPath.startsWith(path)
        )
      ) {
        return NextResponse.redirect(new URL("/service-provider", request.url));
      }
    } else if (role === "user") {
      if (!protectedRoutes.user.some((path) => currentPath.startsWith(path))) {
        return NextResponse.redirect(new URL("/user", request.url));
      }
    } else {
      // If the role doesn't match any case, deny access
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // If the role matches the path, proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error in JWT verification", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Define the routes where the middleware will apply
export const config = {
  matcher: ["/admin/:path*", "/service-provider/:path*", "/user/:path*"], // Define all routes requiring auth
};
