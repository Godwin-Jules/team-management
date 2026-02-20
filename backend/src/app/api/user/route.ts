import { getCurrentUser } from "@/lib/auth";
import { getUsers } from "@/lib/functions";
import { Prisma } from "@/prisma";
import { Role } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "You are not authorized to access user information",
        },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");
    const crossTeam = searchParams.get("crossTeam");

    // build where clause based on user role
    const where: Prisma.UserWhereInput = {};
    if (user.role === Role.ADMIN) {
      // can see all users
    } else if (user.role === Role.MANAGER) {
      if (crossTeam === "false") {
        where.role = {
          not: Role.ADMIN,
        };
      } else {
        // can see users in their team  or cross team users but not cross team managers
        where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
      }
    } else {
      // only see users in their team
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    // Additional filters
    if (teamId) {
      where.teamId = teamId;
    }
    if (role) {
      where.role = role as Role;
    }

    // fetching the users based on the where clause
    const users = await getUsers(
      where,
      {
        id: true,
        email: true,
        name: true,
        role: true,
        team: true,
        createdAt: true,
        updatedAt: true,
      },
      { createdAt: "desc" },
    );

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error. Something went wrong.",
      },
      { status: 500 },
    );
  }
}
