"use client";

import { Toaster } from "@/components/ui/toaster";
import React, { useContext } from "react";
import { AuthContext } from "@/components/providers/auth-provider";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const student = useContext(AuthContext);
  if (student) redirect("/");

  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Toaster />
    </>
  );
}
