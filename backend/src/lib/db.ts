import { prismaClt } from "./prisma";

export async function checkDbConnection(): Promise<boolean> {
  try {
    await prismaClt.$connect();
    await prismaClt.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
