import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UPI FeeLens AI",
  description:
    "Understand UPI fees using live web research and AI.",
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