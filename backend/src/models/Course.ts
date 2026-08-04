import { Schema, model, Document, Types } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  assignedTeacherId: Types.ObjectId;
  enrolledStudentIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    assignedTeacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned teacher is required'],
      index: true,
    },
    enrolledStudentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
CourseSchema.index({ code: 1 });
CourseSchema.index({ assignedTeacherId: 1 });

export const Course = model<ICourse>('Course', CourseSchema);
