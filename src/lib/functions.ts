import { Team } from "@/prisma";
import { prismaClt } from "./prisma";
import { Role } from "@/types";

export const checkUserExists = async (email: string): Promise<boolean> => {
  const response = await prismaClt.user.findUnique({ where: { email } });

  if (response) return true;
  return false;
};

export const getTeamByCode = async (args: {
  where: any;
}): Promise<Team | null> => {
  return await prismaClt.team.findUnique(args);
};

export const getTotalUser = async (): Promise<number> => {
  return await prismaClt.user.count();
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: Role,
  teamId: string | undefined,
): Promise<any> => {
  return prismaClt.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      role: role,
      teamId: teamId,
    },
    include: {
      team: true,
    },
  });
};

export const getUser = async (email: string): Promise<any | null> => {
  return await prismaClt.user.findUnique({
    where: { email: email },
    include: { team: true },
  });
};
