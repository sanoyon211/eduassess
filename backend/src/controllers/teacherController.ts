import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Assignment, AssignmentStatus } from '../models/Assignment';
import { Course } from '../models/Course';

/**
 * @desc    Create a new assignment for a specific course
 * @route   POST /api/teacher/assignments
 * @access  Private (Teacher)
 */
export const createAssignment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, dueDate, courseId, status } = req.body;
    const teacherId = req.user?.userId;

    if (!title || !description || !dueDate || !courseId) {
      res.status(400).json({
        success: false,
        message: 'Title, description, due date, and course ID are required',
      });
      return;
    }

    // Check if target course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Optional check: verify teacher is assigned to this course
    if (course.assignedTeacherId.toString() !== teacherId) {
      res.status(403).json({
        success: false,
        message: 'You can only create assignments for courses assigned to you',
      });
      return;
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate: new Date(dueDate),
      courseId,
      createdByTeacherId: teacherId,
      status: status || AssignmentStatus.PUBLISHED,
    });

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('courseId', 'name code')
      .populate('createdByTeacherId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: populatedAssignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all assignments created by the logged-in teacher
 * @route   GET /api/teacher/assignments
 * @access  Private (Teacher)
 */
export const getMyAssignments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teacherId = req.user?.userId;

    const assignments = await Assignment.find({ createdByTeacherId: teacherId })
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an assignment (with strict IDOR protection)
 * @route   PATCH /api/teacher/assignments/:id
 * @access  Private (Teacher)
 */
export const updateAssignment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;
    const teacherId = req.user?.userId;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
      return;
    }

    // STRICT IDOR PROTECTION: Ensure only creator teacher can modify assignment
    if (assignment.createdByTeacherId.toString() !== teacherId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to modify assignments created by another teacher.',
      });
      return;
    }

    // Apply updates
    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate !== undefined) assignment.dueDate = new Date(dueDate);
    if (status !== undefined) assignment.status = status;

    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignment._id)
      .populate('courseId', 'name code')
      .populate('createdByTeacherId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: updatedAssignment,
    });
  } catch (error) {
    next(error);
  }
};
