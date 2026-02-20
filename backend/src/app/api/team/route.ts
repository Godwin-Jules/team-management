import { getCurrentUser } from "@/lib/auth";
import { prismaClt } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    const teams = prismaClt.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: teams,
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
