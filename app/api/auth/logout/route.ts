import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logged out successfully.",
    });

    // Clear the JWT session cookie by setting maxAge to 0
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediately expires the cookie
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}
