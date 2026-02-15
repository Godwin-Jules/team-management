import { generateToken, hashPassword, verifPassword } from "@/lib/auth";
import { getUser } from "@/lib/functions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "email & password, are required or not valid",
        },
        { status: 400 },
      );
    }

    // Finding existing user
    const userData = await getUser(email);
    if (!userData) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    // Verify the password
    const isValidPassword = await verifPassword(password, userData.password);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Invalid Credentials",
        },
        { status: 401 },
      );
    }

    // Prapare the response
    const token = generateToken(userData.id);
    const response = NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        teamId: userData.teamId,
        team: userData.team,
        token,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30,
    });

    return response;
  } catch (error) {
    console.error("Login failed!", error);
    return NextResponse.json(
      {
        error: "Internal server error. Something went wrong!",
      },
      { status: 500 },
    );
  }
}
