import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, image, isOAuth } = await req.json();

    await connectMongoDB();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    if (isOAuth) {
      // Registering an OAuth user
      await User.create({
        name,
        email,
        image, // Save profile picture if provided
        createdAt: new Date(),
      });
    } else {
      // Registering a user with email and password
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
