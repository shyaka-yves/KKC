import "./globals.css";

import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className={cn(inter.variable)}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
