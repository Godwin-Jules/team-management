import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/authProvider";
import { Role } from "@/types";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { user, hasPermission } = useAuth();
  if (!user || !hasPermission(Role.ADMIN)) {
    redirect("/unauthorized");
  }

  // Fetch data for admin dashboard
  const [users, teams] = await Promise.all([
    apiClient.getUsers({}),
    apiClient.getTeams(),
  ]);

  return <AdminDashboard users={users} teams={teams} currentUser={user} />;
}
