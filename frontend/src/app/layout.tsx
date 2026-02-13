import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Access Control",
  description:
    "Role based access control system built with Next.js 16 & React 19",
  keywords: ["team", "access control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate">{children}</body>
    </html>
  );
}
