import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/authProvider";
import { Role } from "@/types";
import { redirect } from "next/navigation";

export default async function ManagerPage() {
  const { user, hasPermission } = useAuth();
  if (!user || !hasPermission(Role.MANAGER)) {
    redirect("/unauthorized");
  }

  // Fetch manager's own team manager
  const myTeamMembers = user.teamId
    ? await apiClient.getUsers({ teamId: user.teamId, crossTeam: false })
    : [];

  // Fetch all team members (cross-team view - exclude sensitive fields)
  const allMembers=await apiClient.getUsers({crossTeam:false});

  return <ManagerDashboard users={users} teams={teams} currentUser={user} />;
}
