import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Assignment, AssignmentStatus } from '../models/Assignment';
import { Course } from '../models/Course';
import { Submission, SubmissionStatus } from '../models/Submission';

/**
 * @desc    Get all published assignments for courses the student is enrolled in
 * @route   GET /api/student/assignments
 * @access  Private (Student)
 */
export const getEnrolledAssignments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // IDOR Protection: Always use authenticated user's ID
    const studentId = req.user?.userId;

    // Find all courses student is enrolled in
    const enrolledCourses = await Course.find({ enrolledStudentIds: studentId }).select('_id');
    const courseIds = enrolledCourses.map((c) => c._id);

    // Fetch published assignments for these courses
    const assignments = await Assignment.find({
      courseId: { $in: courseIds },
      status: AssignmentStatus.PUBLISHED,
    })
      .populate('courseId', 'name code')
      .populate('createdByTeacherId', 'name email')
      .sort({ dueDate: 1 });

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
 * @desc    Submit an assignment for a course (Strict IDOR prevention & deadline enforcement)
 * @route   POST /api/student/submissions
 * @access  Private (Student)
 */
export const submitAssignment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId, fileUrl } = req.body;
    // IDOR Protection: Force student ID to match authenticated user
    const studentId = req.user?.userId;

    if (!assignmentId || !fileUrl) {
      res.status(400).json({
        success: false,
        message: 'Assignment ID and file URL are required',
      });
      return;
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
      return;
    }

    if (assignment.status !== AssignmentStatus.PUBLISHED) {
      res.status(400).json({
        success: false,
        message: 'Cannot submit to an unpublished assignment',
      });
      return;
    }

    // Verify student is enrolled in the course offering this assignment
    const isEnrolled = await Course.findOne({
      _id: assignment.courseId,
      enrolledStudentIds: studentId,
    });

    if (!isEnrolled) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You are not enrolled in the course for this assignment.',
      });
      return;
    }

    // Deadline Enforcement: Prevent submission past dueDate
    const now = new Date();
    if (now > new Date(assignment.dueDate)) {
      res.status(400).json({
        success: false,
        message: 'Submission failed. The assignment due date has passed.',
      });
      return;
    }

    // Check if student has already submitted for this assignment
    const existingSubmission = await Submission.findOne({ assignmentId, studentId });
    if (existingSubmission) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted a solution for this assignment.',
      });
      return;
    }

    const submission = await Submission.create({
      assignmentId,
      studentId,
      fileUrl,
      submittedAt: now,
      status: SubmissionStatus.PENDING,
    });

    const populatedSubmission = await Submission.findById(submission._id)
      .populate({
        path: 'assignmentId',
        select: 'title description dueDate courseId',
        populate: { path: 'courseId', select: 'name code' },
      })
      .populate('studentId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: populatedSubmission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student's own submissions and grades (Strict IDOR prevention)
 * @route   GET /api/student/submissions
 * @access  Private (Student)
 */
export const getMySubmissions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // IDOR Protection: Always retrieve strictly for req.user.userId
    const studentId = req.user?.userId;

    const submissions = await Submission.find({ studentId })
      .populate({
        path: 'assignmentId',
        select: 'title description dueDate courseId',
        populate: { path: 'courseId', select: 'name code' },
      })
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
