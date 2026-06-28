import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeChef Kitchen Cook-Off",
  description: "Contest Control Center — CodeChef VIT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  );
}
