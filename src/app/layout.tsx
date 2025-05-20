import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { Chatbot } from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management System",
  description: "A simple project management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
        <Chatbot />
      </body>
    </html>
  );
}
