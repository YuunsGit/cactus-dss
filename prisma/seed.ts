import { PrismaClient } from "@prisma/client";
import lecturers from "./lecturers.json";
import classrooms from "./classrooms.json";
import departments from "./departments.json";
import students from "./students.json";
import courses from "./courses.json";
import departmentCourses from "./department-courses.json";
import courseSchedules from "./course-schedules.json";

const prisma = new PrismaClient();

async function main() {
  // for (const cr of classrooms) {
  //   await prisma.classroom.create({
  //     data: {
  //       title: cr.title,
  //       capacity: cr.capacity,
  //     },
  //   });
  // }
  // for (const dep of departments) {
  //   await prisma.department.create({
  //     data: {
  //       title: dep.title,
  //       faculty: dep.faculty,
  //     },
  //   });
  // }
  // for (const lec of lecturers) {
  //   await prisma.lecturer.create({
  //     data: {
  //       firstName: lec.firstName,
  //       lastName: lec.lastName,
  //       email: lec.email,
  //       password: lec.password,
  //       departmentId: Math.floor(Math.random() * 4) + 1,
  //       gender: lec.gender,
  //       isActive: lec.isActive,
  //     },
  //   });
  // }
  // let id = 200204002;
  // for (const st of students) {
  //   await prisma.student.create({
  //     data: {
  //       studentId: id++,
  //       firstName: st.firstName,
  //       lastName: st.lastName,
  //       email: st.email,
  //       password: st.password,
  //       departmentId: Math.floor(Math.random() * 4) + 1,
  //       advisorId: Math.floor(Math.random() * 30) + 1,
  //       isActive: st.isActive,
  //       gender: st.gender,
  //       yearOfEntry: st.yearOfEntry,
  //       semester: st.semester,
  //     },
  //   });
  // }
  // for (const crs of courses) {
  //   await prisma.course.create({
  //     data: {
  //       title: crs.CourseName,
  //       code: crs.CourseCode,
  //       credit: crs.C,
  //       ects: crs.ECTS,
  //       capacity: Math.max((Math.floor(Math.random() * 30) + 1) * 2, 20),
  //     },
  //   });
  // }
  // for (const crs of departmentCourses) {
  //   await prisma.departmentCourse.create({
  //     data: {
  //       departmentId: crs.Department,
  //       courseId: crs.courseId,
  //       isElective: crs.Compulsory !== 1,
  //       semester: crs.Semester,
  //     },
  //   });
  // }
  // for (const crs of courseSchedules) {
  //   await prisma.courseSchedule.create({
  //     data: {
  //       courseId: parseInt(crs.courseId),
  //       dayOfWeek: crs.dayOfWeek,
  //       startTime: crs.startTime,
  //       endTime: crs.endTime,
  //       classroomId: parseInt(crs.classroomId),
  //     },
  //   });
  // }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
