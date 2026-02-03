import "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prismaClt } from "./prisma";
import { Role, User } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30m" });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;
    if (!token) return null;

    const decode = verifyToken(token);
    const userData = await prismaClt.user.findUnique({
      where: { id: decode.userId },
    });
    if (!userData) return null;

    const { password, ...user } = userData;
    return user as User;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const checkUserPermission = (
  user: User,
  requiredRole: Role,
): boolean => {
  const roleHierarchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.MANAGER]: 2,
    [Role.ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
