interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  semester: number;
  department: string;
  advisor: string;
  advisorGender: string;
  departmentId: number;
  advisorId: number;
}

interface DepartmentCourse {
  departmentId: number;
  courseId: number;
  isElective: boolean;
  semester: number;
}

interface Course {
  courseId: number;
  title: string;
  code: string;
  ects: number;
  credit: number;
  capacity: number;
  isActive: boolean;
  gradeDistribution: string[];
  isOnline: boolean;
}
