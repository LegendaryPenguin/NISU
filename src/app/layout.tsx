import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import { DailyProgressProvider } from "@/context/DailyProgressContext";
import { StreakProvider } from "@/context/StreakContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NISU — Summer Life OS",
  description:
    "Your personal summer life operating system. Stay consistent with fitness, fuel, skills, and mindset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <DailyProgressProvider>
            <StreakProvider>
              <Navigation />
              <main className="flex-1 pb-20">{children}</main>
            </StreakProvider>
          </DailyProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
