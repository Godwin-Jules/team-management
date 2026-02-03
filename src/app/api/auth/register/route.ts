import { generateToken, hashPassword } from "@/lib/auth";
import {
  checkUserExists,
  createUser,
  getTeamByCode,
  getTotalUser,
} from "@/lib/functions";
import { Role } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email & password, are required or not valid",
        },
        { status: 400 },
      );
    }

    // Find existing user
    const exists = await checkUserExists(email);
    if (exists) {
      return NextResponse.json(
        {
          error: "User with this email address already exists.",
        },
        { status: 409 },
      );
    }

    let teamId: string | undefined;
    if (teamCode) {
      const team = await getTeamByCode({ where: { code: teamCode } });

      if (!team) {
        return NextResponse.json(
          {
            error: "Please enter a valid team code.",
          },
          { status: 400 },
        );
      }

      teamId = team.id;
    }

    const hashedPassword = await hashPassword(password);

    // First user become ADMIN, others become USER
    const userCount = await getTotalUser();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await createUser(name, email, hashedPassword, role, teamId);
    const token = generateToken(user.id);

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        team: user.team,
        token: token,
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
    console.error("Registration failed", error);
    return NextResponse.json(
      {
        error: "Internal server error. Something went wrong!",
      },
      { status: 500 },
    );
  }
}
