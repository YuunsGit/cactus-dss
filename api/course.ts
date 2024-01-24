"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCourses = async (student: Student) => {
  return prisma.departmentCourse.findMany({
    where: { semester: student.semester, departmentId: student.departmentId },
    include: {
      course: {
        include: {
          courseSchedules: true,
        },
      },
    },
  });
};

export { getCourses };
