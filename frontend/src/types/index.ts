export enum UserRole {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  STUDENT = 'Student',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  assignedTeacherId?: User | string;
  enrolledStudentIds?: (User | string)[];
  createdAt?: string;
  updatedAt?: string;
}

export enum AssignmentStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: Course | string;
  createdByTeacherId?: User | string;
  maxMarks: number;
  status: AssignmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum SubmissionStatus {
  PENDING = 'Pending',
  GRADED = 'Graded',
}

export interface Submission {
  _id: string;
  assignmentId: Assignment | string;
  studentId: User | string;
  fileUrl: string;
  submittedAt: string;
  status: SubmissionStatus;
  marks?: number;
  teacherFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}