import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Choi family recipes",
  description: "View and download recipe PDFs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
