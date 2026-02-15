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
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to assign team",
        },
        { status: 401 },
      );
    }

    const { teamId } = await request.json();

    if (teamId) {
      const team = await getTeamByCode({ where: { id: teamId } });

      if (!team) {
        return NextResponse.json(
          {
            error: "Team not found",
          },
          { status: 404 },
        );
      }
    }

    // update user's team assignment
    const updatedUser = await updateUser(
      { id: userId },
      { teamId: teamId },
      { team: true },
    );
    const { password, ...upUser } = updatedUser;

    return NextResponse.json({
      user: upUser,
      message: teamId
        ? "User assigned to team successfully"
        : "User removed to team successfully",
    });
  } catch (error) {
    console.error("Team assignment error:", error);
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
