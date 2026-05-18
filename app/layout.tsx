import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina Spend — Premium Canadian Student Finance Hub",
  description:
    "An enterprise-grade financial management platform tailored for students and young professionals moving to Canada. Track rental costs, transit passes, part-time jobs, and savings goals in CAD with premium glassmorphic analytics.",
  keywords: ["Canada Student Finance", "Expense Tracker CAD", "Interac tracker", "Student Budget Canada", "Fintech Dashboard"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
