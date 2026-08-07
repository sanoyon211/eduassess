import { Schema, model, Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  STUDENT = 'Student',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: '{VALUE} is not a valid role',
      },
      default: UserRole.STUDENT,
    },
  },
  {
    timestamps: true,
  }
);

// Explicit schema indexes
UserSchema.index({ role: 1 });
UserSchema.index({ email: 1, role: 1 });

export const User = model<IUser>('User', UserSchema);
