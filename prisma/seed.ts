import { hashPassword } from "@/lib/auth";
import { prismaClt } from "@/lib/prisma";
import { Role } from "@/types";

async function main() {
  console.log("Starting data seeding...");

  // create teams
  const teams = await Promise.all([
    prismaClt.team.create({
      data: {
        name: "Engineering",
        description: "Software development team",
        code: "ENG-2026",
      },
    }),
    prismaClt.team.create({
      data: {
        name: "Marketing",
        description: "Marketing and sales team",
        code: "MKT-2026",
      },
    }),
    prismaClt.team.create({
      data: {
        name: "Operations",
        description: "Business operations team",
        code: "OPS-2026",
      },
    }),
    prismaClt.team.create({
      data: {
        name: "Human Resources",
        description: "Human Resources team",
        code: "HR-2026",
      },
    }),
  ]);

  // create users
  const users = [
    {
      name: "John Developer",
      email: "john@company.com",
      password: "john2026",
      team: teams[0],
      role: Role.MANAGER,
    },
    {
      name: "Jane Designer",
      email: "jane@company.com",
      role: Role.USER,
      team: teams[0],
    },
    {
      name: "Bob Marketer",
      email: "bob@company.com",
      role: Role.MANAGER,
      team: teams[1],
    },
    {
      name: "Alice Sales",
      email: "alice@company.com",
      role: Role.USER,
      team: teams[1],
    },
  ];

  for (const userData of users) {
    await prismaClt.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: await hashPassword("123456"),
        role: userData.role,
        teamId: userData.team.id,
      },
    });
  }

  console.log("✅ Data seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClt.$disconnect();
  });
