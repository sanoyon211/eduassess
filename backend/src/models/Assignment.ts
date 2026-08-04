import { Schema, model, Document, Types } from 'mongoose';

export enum AssignmentStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  courseId: Types.ObjectId;
  createdByTeacherId: Types.ObjectId;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true,
    },
    createdByTeacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(AssignmentStatus),
        message: '{VALUE} is not a valid status',
      },
      default: AssignmentStatus.PUBLISHED,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexing for fast queries by course and due date
AssignmentSchema.index({ courseId: 1, dueDate: 1 });
AssignmentSchema.index({ createdByTeacherId: 1, status: 1 });

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);
