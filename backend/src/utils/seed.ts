import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';
import { Assignment, AssignmentStatus } from '../models/Assignment';
import { Submission } from '../models/Submission';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduassess';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Database connected successfully.');

    // Clear existing database collections
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    console.log('[Seed] Database cleared.');

    // Default password for all seeded users
    const defaultPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // 1. Insert 1 Admin, 2 Teachers, 3 Students
    console.log('[Seed] Creating users...');
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@eduassess.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const teacher1 = await User.create({
      name: 'Prof. Alan Turing',
      email: 'teacher1@eduassess.com',
      password: hashedPassword,
      role: UserRole.TEACHER,
    });

    const teacher2 = await User.create({
      name: 'Prof. Ada Lovelace',
      email: 'teacher2@eduassess.com',
      password: hashedPassword,
      role: UserRole.TEACHER,
    });

    const student1 = await User.create({
      name: 'Alice Johnson',
      email: 'student1@eduassess.com',
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    const student2 = await User.create({
      name: 'Bob Smith',
      email: 'student2@eduassess.com',
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    const student3 = await User.create({
      name: 'Charlie Davis',
      email: 'student3@eduassess.com',
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    // 2. Insert 2 Courses
    console.log('[Seed] Creating courses...');
    const course1 = await Course.create({
      name: 'Computer Science 101',
      code: 'CS101',
      assignedTeacherId: teacher1._id,
      enrolledStudentIds: [student1._id, student2._id],
    });

    const course2 = await Course.create({
      name: 'Web Engineering 301',
      code: 'WE301',
      assignedTeacherId: teacher2._id,
      enrolledStudentIds: [student2._id, student3._id],
    });

    // 3. Insert Assignments
    console.log('[Seed] Creating assignments...');
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    await Assignment.create([
      {
        title: 'Data Structures & Recursion Lab',
        description: 'Implement binary search tree operations and recursive traversal algorithms in C++/TypeScript.',
        dueDate: sevenDaysFromNow,
        courseId: course1._id,
        createdByTeacherId: teacher1._id,
        status: AssignmentStatus.PUBLISHED,
      },
      {
        title: 'Full-Stack Architecture Report',
        description: 'Design a RESTful API specification and database schema for an e-learning platform.',
        dueDate: tenDaysFromNow,
        courseId: course2._id,
        createdByTeacherId: teacher2._id,
        status: AssignmentStatus.PUBLISHED,
      },
      {
        title: 'Algorithm Complexity Quiz (Draft)',
        description: 'Analyze Big-O time and space complexity for sorting algorithms.',
        dueDate: sevenDaysFromNow,
        courseId: course1._id,
        createdByTeacherId: teacher1._id,
        status: AssignmentStatus.DRAFT,
      },
    ]);

    // Print Credentials summary to Console
    console.log('\n======================================================');
    console.log('         EDUASSESS SEED COMPLETED SUCCESSFULLY        ');
    console.log('======================================================');
    console.log(`Default Password for All Users: ${defaultPassword}\n`);
    console.log('ROLE       | EMAIL                   | NAME');
    console.log('-----------+-------------------------+-------------------');
    console.log(`Admin      | ${admin.email.padEnd(23)} | ${admin.name}`);
    console.log(`Teacher 1  | ${teacher1.email.padEnd(23)} | ${teacher1.name}`);
    console.log(`Teacher 2  | ${teacher2.email.padEnd(23)} | ${teacher2.name}`);
    console.log(`Student 1  | ${student1.email.padEnd(23)} | ${student1.name}`);
    console.log(`Student 2  | ${student2.email.padEnd(23)} | ${student2.name}`);
    console.log(`Student 3  | ${student3.email.padEnd(23)} | ${student3.name}`);
    console.log('------------------------------------------------------');
    console.log(`Courses Created: ${course1.code} (${course1.name}), ${course2.code} (${course2.name})`);
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
