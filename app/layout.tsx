import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manish Karki | Freelance Web Developer",
  description:
    "Freelance Web Developer from Nepal building modern websites, business platforms and web applications.",
  keywords: [
    "Manish Karki",
    "Web Developer",
    "Next.js",
    "Portfolio",
    "Frontend Developer",
    "Nepal",
  ],
  authors: [{ name: "Manish Karki" }],
  openGraph: {
    title: "Manish Karki",
    description:
      "Premium portfolio showcasing modern websites and business solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}