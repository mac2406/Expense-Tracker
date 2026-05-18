import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 }); // Return null user instead of crashing for graceful client handling
    }

    // Verify JWT payload
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Fetch fresh user profile details from the database
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during session check." },
      { status: 500 }
    );
  }
}
