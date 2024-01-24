"use client";

import React, { createContext } from "react";

export const AuthContext = createContext<Student | null>(null);

export default function AuthProvider({
  children,
  student,
}: {
  children: React.ReactNode;
  student: Student | null;
}) {
  return (
    <AuthContext.Provider value={student}>{children}</AuthContext.Provider>
  );
}
