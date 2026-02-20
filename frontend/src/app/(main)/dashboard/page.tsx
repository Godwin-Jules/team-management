import { useAuth } from "@/provider/authProvider";
import { Role } from "@/types";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = useAuth();
  if (!user) {
    redirect("/login");
  }

  // Redirect based on user role
  switch (user.role) {
    case Role.ADMIN:
      redirect("/dashboard/admin");
    case Role.MANAGER:
      redirect("/dashboard/manager");
    case Role.USER:
      redirect("/dashboard/user");
    default:
      redirect("/dashboard/user");
  }
}
