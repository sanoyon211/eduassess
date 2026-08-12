import { Schema, model, Document, Types } from 'mongoose';

export enum SubmissionStatus {
  PENDING = 'Pending',
  GRADED = 'Graded',
}

export interface ISubmission extends Document {
  assignmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  fileUrl: string;
  submittedAt: Date;
  status: SubmissionStatus;
  marks?: number;
  teacherFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Submission file URL is required'],
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(SubmissionStatus),
        message: '{VALUE} is not a valid submission status',
      },
      default: SubmissionStatus.PENDING,
      index: true,
    },
    marks: {
      type: Number,
      min: [0, 'Marks cannot be negative'],
    },
    teacherFeedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
SubmissionSchema.index({ studentId: 1, status: 1 });

export const Submission = model<ISubmission>('Submission', SubmissionSchema);
