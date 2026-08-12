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
    const studentId = req.user?.userId;

    const enrolledCourses = await Course.find({ enrolledStudentIds: studentId }).select('_id');
    const courseIds = enrolledCourses.map((c) => c._id);

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

export const submitAssignment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId, fileUrl } = req.body;
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

    const now = new Date();
    if (now > new Date(assignment.dueDate)) {
      res.status(400).json({
        success: false,
        message: 'Submission failed. The assignment due date has passed.',
      });
      return;
    }

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

export const getMySubmissions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

export const updateSubmission = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fileUrl } = req.body;
    const studentId = req.user?.userId;

    if (!fileUrl) {
      res.status(400).json({
        success: false,
        message: 'Updated submission file URL is required',
      });
      return;
    }

    const submission = await Submission.findById(id);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
      return;
    }

    if (submission.studentId.toString() !== studentId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You can only update your own submission.',
      });
      return;
    }

    if (submission.status === SubmissionStatus.GRADED) {
      res.status(400).json({
        success: false,
        message: 'Cannot update a submission that has already been graded by the teacher.',
      });
      return;
    }

    const assignment = await Assignment.findById(submission.assignmentId);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Associated assignment not found',
      });
      return;
    }

    const now = new Date();
    if (now > new Date(assignment.dueDate)) {
      res.status(400).json({
        success: false,
        message: 'Submission update failed. The assignment due date has passed.',
      });
      return;
    }

    submission.fileUrl = fileUrl;
    submission.submittedAt = now;
    await submission.save();

    const updatedSubmission = await Submission.findById(submission._id)
      .populate({
        path: 'assignmentId',
        select: 'title description dueDate courseId maxMarks',
        populate: { path: 'courseId', select: 'name code' },
      })
      .populate('studentId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      data: updatedSubmission,
    });
  } catch (error) {
    next(error);
  }
};
