import { checkUserPermission, getCurrentUser } from "@/lib/auth";
import { getTeamByCode, updateUser } from "@/lib/functions";
import { Role } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const current_user = await getCurrentUser();

    if (!current_user || !checkUserPermission(current_user, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to assign team",
        },
        { status: 401 },
      );
    }

    // prevent users from changing their own role
    if (userId === current_user.id) {
      return NextResponse.json(
        {
          error: "You cannot change your own role",
        },
        { status: 401 },
      );
    }

    const { role } = await request.json();

    // validate the role
    const validateRoles = [Role.USER, Role.MANAGER];
    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid user role or you cannot have more than one admin role user",
        },
        { status: 401 },
      );
    }

    // update user's team assignment
    const updatedUser = await updateUser(
      { id: userId },
      { role: role },
      { team: true },
    );
    const { password, ...upUser } = updatedUser;

    return NextResponse.json({
      user: upUser,
      message: `User user role updated to ${role} successfully`,
    });
  } catch (error) {
    console.error("Role assignment error:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Internal server error, something went wrong" },
      { status: 500 },
    );
  }
}
