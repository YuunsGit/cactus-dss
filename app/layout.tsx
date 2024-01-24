import { PT_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import React from "react";

const pt_sans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Cactus DSS",
  description: "DSS for student information systems.",
  metadataBase: new URL("https://dss.yunusemre.dev"),

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "https://dss.yunusemre.dev/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies().get("session");

  return (
    <html lang="en">
      <body className={pt_sans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider student={JSON.parse(cookie?.value || "null")}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
