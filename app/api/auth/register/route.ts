import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, name, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash: hashedPassword,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    // Automatically trigger a welcome system notification for the user
    await db.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        message: `🇨🇦 Welcome to Canada, ${name}! Your premium student finance dashboard is fully set up.`,
      },
    });

    // Return the created user (sanitize and exclude the password hash)
    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
