"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

const signIn = async (studentId: string, password: string) => {
  const student = await prisma.student.findUnique({
    where: { studentId: parseInt(studentId) },
  });

  if (!student) {
    return { error: "Invalid email or password", student };
  }

  if (student.password !== password) {
    return { error: "Invalid email or password" };
  }

  const department = await prisma.department.findUnique({
    where: { departmentId: student.departmentId },
  });

  const advisor = await prisma.lecturer.findUnique({
    where: { lecturerId: student.advisorId },
  });

  cookies().set(
    "session",
    JSON.stringify({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      gender: student.gender,
      semester: student.semester,
      department: department ? department.title : "",
      advisor: advisor ? `${advisor.firstName} ${advisor.lastName}` : "",
      advisorGender: advisor ? advisor.gender : "Male",
      departmentId: student.departmentId,
      advisorId: student.advisorId,
    }),
    {
      secure: true,
      httpOnly: true,
    },
  );

  return {
    message: "Login successful",
    student: {
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      departmentId: student.departmentId,
      advisorId: student.advisorId,
    },
  };
};

const signOut = () => {
  cookies().delete("session");

  return {
    message: "Logout successful",
  };
};

export { signIn, signOut };
