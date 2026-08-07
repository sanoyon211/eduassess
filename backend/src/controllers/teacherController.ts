import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Assignment, AssignmentStatus } from '../models/Assignment';
import { Course } from '../models/Course';
import { Submission, SubmissionStatus } from '../models/Submission';

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
    const { title, description, dueDate, courseId, maxMarks, status } = req.body;
    const teacherId = req.user?.userId;

    if (!title || !description || !dueDate || !courseId) {
      res.status(400).json({
        success: false,
        message: 'Title, description, due date, and course ID are required',
      });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

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
      maxMarks: maxMarks !== undefined ? Number(maxMarks) : 100,
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
 * @desc    Get all courses assigned to the logged-in teacher
 * @route   GET /api/teacher/courses
 * @access  Private (Teacher)
 */
export const getMyCourses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teacherId = req.user?.userId;

    const courses = await Course.find({ assignedTeacherId: teacherId })
      .populate('enrolledStudentIds', 'name email')
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
    const { title, description, dueDate, maxMarks, status } = req.body;
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

    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate !== undefined) assignment.dueDate = new Date(dueDate);
    if (maxMarks !== undefined) assignment.maxMarks = Number(maxMarks);
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

/**
 * @desc    Get all student submissions for a specific assignment (IDOR protected)
 * @route   GET /api/teacher/assignments/:assignmentId/submissions
 * @access  Private (Teacher)
 */
export const getAssignmentSubmissions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const teacherId = req.user?.userId;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
      return;
    }

    // IDOR Protection: Validate that the assignment was created by the requesting teacher
    if (assignment.createdByTeacherId.toString() !== teacherId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You can only view submissions for assignments created by you.',
      });
      return;
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Grade a student submission (IDOR protected)
 * @route   PATCH /api/teacher/submissions/:submissionId/grade
 * @access  Private (Teacher)
 */
export const gradeSubmission = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { submissionId } = req.params;
    const { marks, teacherFeedback } = req.body;
    const teacherId = req.user?.userId;

    if (marks === undefined || typeof marks !== 'number') {
      res.status(400).json({
        success: false,
        message: 'A numeric marks value is required',
      });
      return;
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
      return;
    }

    // Fetch associated assignment to verify ownership & maximum marks limit
    const assignment = await Assignment.findById(submission.assignmentId);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Associated assignment not found',
      });
      return;
    }

    // IDOR Protection: Ensure teacher cannot grade submissions for assignments belonging to other teachers
    if (assignment.createdByTeacherId.toString() !== teacherId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot grade submissions for assignments belonging to another teacher.',
      });
      return;
    }

    if (marks < 0 || marks > assignment.maxMarks) {
      res.status(400).json({
        success: false,
        message: `Marks must be between 0 and maximum marks (${assignment.maxMarks})`,
      });
      return;
    }

    submission.marks = marks;
    submission.teacherFeedback = teacherFeedback || '';
    submission.status = SubmissionStatus.GRADED;

    await submission.save();

    const updatedSubmission = await Submission.findById(submission._id)
      .populate('studentId', 'name email')
      .populate({
        path: 'assignmentId',
        select: 'title courseId',
        populate: { path: 'courseId', select: 'name code' },
      });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: updatedSubmission,
    });
  } catch (error) {
    next(error);
  }
};
