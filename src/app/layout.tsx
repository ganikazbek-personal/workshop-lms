import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/lms/ThemeProvider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AI Builder Workshop",
  description: "Практический воркшоп по вайб-кодингу",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} min-h-screen`}
        style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
