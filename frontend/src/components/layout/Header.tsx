"use client";

import { User } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathname === "/";
    } else if (href === "/dashboard") {
      isActive = pathname.startsWith(href);
    }

    return `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-white">
            Team Access
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-300">
                  {user.name} - {user.role}
                </span>
                <button
                  // onClick={}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="py-2 px-4 bg-slate-800 text-slate-300 rounded-sm hover:bg-slate-700 transition"
                >
                  Login
                </Link>
                <Link
                  href={"/register"}
                  className="py-2 px-4 bg-blue-800 text-white rounded-sm hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
