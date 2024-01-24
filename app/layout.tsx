import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";

const pt_sans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Cactus SIS",
  description: "Student Information Systems",
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
