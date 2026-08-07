import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduAssess API Documentation',
      version: '1.0.0',
      description:
        'Enterprise Role-Based Assignment Management System API for Admins, Teachers, and Students.',
      contact: {
        name: 'EduAssess Engineering Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message description' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65e1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Prof. Alan Turing' },
            email: { type: 'string', example: 'teacher1@eduassess.com' },
            role: { type: 'string', enum: ['Admin', 'Teacher', 'Student'], example: 'Teacher' },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Computer Science 101' },
            code: { type: 'string', example: 'CS101' },
            assignedTeacherId: { type: 'string' },
            enrolledStudentIds: { type: 'array', items: { type: 'string' } },
          },
        },
        Assignment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Data Structures Lab' },
            description: { type: 'string', example: 'Implement binary search tree' },
            dueDate: { type: 'string', format: 'date-time' },
            maxMarks: { type: 'number', example: 100 },
            status: { type: 'string', enum: ['Draft', 'Published'], example: 'Published' },
            courseId: { type: 'string' },
            createdByTeacherId: { type: 'string' },
          },
        },
        Submission: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            assignmentId: { type: 'string' },
            studentId: { type: 'string' },
            fileUrl: { type: 'string', example: 'https://github.com/student/lab-solution' },
            submittedAt: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['Pending', 'Graded'], example: 'Pending' },
            marks: { type: 'number', example: 95 },
            teacherFeedback: { type: 'string', example: 'Excellent recursive solution!' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
