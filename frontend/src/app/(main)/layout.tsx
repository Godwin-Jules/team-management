import Header from "@/components/layout/Header";
import React from "react";
import "@/app/globals.css";
import { apiClient } from "@/lib/apiClient";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const user = await apiClient.getCurrentUser();
  return (
    <>
      <Header user={user}/>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
