import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

/** Root layout — wraps every page with HTML shell and global dark theme styles */
export const metadata: Metadata = {
  title: "LearnDash - Student Dashboard",
  description: "Next-Gen Learning Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
