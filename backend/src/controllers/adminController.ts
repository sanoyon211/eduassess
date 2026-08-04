import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';

/**
 * @desc    Get list of all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of all courses
 * @route   GET /api/admin/courses
 * @access  Private (Admin)
 */
export const getAllCourses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await Course.find()
      .populate('assignedTeacherId', 'name email role')
      .populate('enrolledStudentIds', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/admin/courses
 * @access  Private (Admin)
 */
export const createCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, code, assignedTeacherId } = req.body;

    if (!name || !code || !assignedTeacherId) {
      res.status(400).json({
        success: false,
        message: 'Course name, code, and assigned teacher ID are required',
      });
      return;
    }

    const teacher = await User.findById(assignedTeacherId);
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      res.status(400).json({
        success: false,
        message: 'Invalid teacher ID. Assigned user must exist and have Teacher role.',
      });
      return;
    }

    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      res.status(400).json({
        success: false,
        message: `Course with code '${code.toUpperCase()}' already exists`,
      });
      return;
    }

    const course = await Course.create({
      name,
      code: code.toUpperCase(),
      assignedTeacherId,
      enrolledStudentIds: [],
    });

    const populatedCourse = await Course.findById(course._id).populate(
      'assignedTeacherId',
      'name email role'
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: populatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign or reassign a teacher to a course
 * @route   PATCH /api/admin/courses/:courseId/assign-teacher
 * @access  Private (Admin)
 */
export const assignTeacherToCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      res.status(400).json({
        success: false,
        message: 'Teacher ID is required',
      });
      return;
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      res.status(400).json({
        success: false,
        message: 'Target user must exist and have Teacher role',
      });
      return;
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { assignedTeacherId: teacherId },
      { new: true, runValidators: true }
    ).populate('assignedTeacherId', 'name email role');

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Teacher assigned to course successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enroll students into a course
 * @route   POST /api/admin/courses/:courseId/enroll-students
 * @access  Private (Admin)
 */
export const enrollStudentsToCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'studentIds must be a non-empty array of user IDs',
      });
      return;
    }

    const validStudents = await User.find({
      _id: { $in: studentIds },
      role: UserRole.STUDENT,
    });

    if (validStudents.length !== studentIds.length) {
      res.status(400).json({
        success: false,
        message: 'One or more provided IDs are invalid or do not belong to students',
      });
      return;
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudentIds: { $each: studentIds } } },
      { new: true, runValidators: true }
    )
      .populate('assignedTeacherId', 'name email')
      .populate('enrolledStudentIds', 'name email role');

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Students enrolled into course successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
