# EduAssess - Role-Based Assignment Management System

**EduAssess** is a full-stack, enterprise-grade Role-Based Assignment Management System designed for modern educational institutions. It provides dedicated, secure, and intuitive web interfaces for **Admins**, **Faculty Teachers**, and **Students** to manage course catalogs, publish assignments, enforce submission deadlines, and conduct transparent grading evaluations.

---

## 🚀 Key Features & Architectural Highlights

### 🛡️ Security & Role-Based Access Control (RBAC)
- **JWT Authentication**: Secure session state management using JSON Web Tokens with password hashing powered by `bcryptjs`.
- **Role Authorization Middleware**: Route protection via `verifyToken` and `authorizeRoles('Admin' | 'Teacher' | 'Student')`.
- **IDOR Protection**: Strict ownership checks ensuring teachers can only modify/grade their own assignments, and students can only view/submit their own solutions.

### 🎨 Enterprise Light Mode Aesthetic
- **Strictly Light Mode UI**: Dark mode is globally disabled (`darkMode: "class"`, forced `color-scheme: light`).
- **Corporate Slate Palette**: Clean `bg-slate-50` background, `text-slate-900` typography, white cards with `border-slate-200`, and minimal `shadow-sm`.
- **Pulsing Skeleton Loaders**: Professional gray `<Skeleton>` placeholders during data fetching.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 14+ (App Router, Client & Server Components)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS (Strictly Light Mode)
- **Typography**: Google Font **Inter**
- **HTTP Client**: Axios with JWT Bearer request/response interceptors
- **Icons**: Lucide React
- **Date Formatting**: `date-fns`
- **Session Cookies**: `js-cookie`

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: MongoDB via Mongoose ORM
- **Authentication**: `jsonwebtoken` & `bcryptjs`
- **Error Handling**: Global error middleware & 404 handler with standard HTTP status codes

---

## 📂 Project Directory Structure

```
eduassess/
├── package.json                 # Monorepo workspace configuration
├── .gitignore                   # Ignores node_modules, .env, build outputs
├── README.md                    # System documentation
│
├── backend/                     # Express TypeScript REST API Engine
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env / .env.example
│   └── src/
│       ├── app.ts               # Express application initialization & middleware pipeline
│       ├── server.ts            # HTTP server entrypoint
│       ├── config/              # MongoDB Mongoose connection (db.ts)
│       ├── controllers/         # Auth, Admin, Teacher, and Student controllers
│       ├── middlewares/         # JWT verifyToken, authorizeRoles, & errorHandler
│       ├── models/              # User, Course, Assignment, & Submission Mongoose schemas
│       ├── routes/              # Auth, Admin, Teacher, and Student API routers
│       └── utils/               # JWT helpers & Database Seeder (seed.ts)
│
└── frontend/                    # Next.js 14 App Router Web Application
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts       # Strictly Light Mode Tailwind configuration
    └── src/
        ├── app/
        │   ├── layout.tsx       # Root layout wrapped with AuthProvider & Inter font
        │   ├── globals.css      # Corporate Slate-50 styling
        │   ├── page.tsx         # Public landing portal
        │   ├── login/           # Centered authentication page
        │   ├── admin/           # Admin Dashboard, User Directory, & Course Management
        │   ├── teacher/         # Teacher Dashboard, Assignment Creator, & Grading View
        │   └── student/         # Student Dashboard, Coursework List, & Submission Form
        ├── components/
        │   ├── ui/              # Reusable Button, Input, DataTable, Badge, & Skeleton
        │   └── layout/          # DashboardLayout, Navbar, & Sidebar
        ├── context/             # AuthContext (state, login, logout, & role redirect)
        └── lib/                 # Axios client with JWT interceptor
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` OR MongoDB Atlas connection URI

---

### Step 1: Clone Repository & Install Monorepo Dependencies

```bash
git clone https://github.com/sanoyon211/eduassess.git
cd eduassess

# Install monorepo dependencies for both backend and frontend
npm install
```

---

### Step 2: Configure Environment Variables

#### Backend Environment (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eduassess
JWT_SECRET=eduassess_super_secret_jwt_key_2026_safe
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment (`frontend/.env.local` - Optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Step 3: Run Database Seeder Script

Seed the database with default Admin, Faculty Teachers, Students, Courses, and Assignments:

```bash
cd backend
npm run seed
```

---

### Step 4: Run Development Servers

#### Option A: Run from Root Monorepo
```bash
# Run Backend API Server
npm run dev:backend

# Run Frontend Web App (In a separate terminal)
npm run dev:frontend
```

#### Option B: Run Independently
```bash
# Start Backend (http://localhost:5000)
cd backend
npm run dev

# Start Frontend (http://localhost:3000)
cd frontend
npm run dev
```

---

## 🔑 Demo Seed Login Credentials

All seeded accounts use the default password: **`Password123!`**

| Role | Name | Email Address | Default Password |
| :--- | :--- | :--- | :--- |
| **System Admin** | System Admin | `admin@eduassess.com` | `Password123!` |
| **Teacher (Faculty)** | Prof. Alan Turing | `teacher1@eduassess.com` | `Password123!` |
| **Teacher (Faculty)** | Prof. Ada Lovelace | `teacher2@eduassess.com` | `Password123!` |
| **Student** | Alice Johnson | `student1@eduassess.com` | `Password123!` |
| **Student** | Bob Smith | `student2@eduassess.com` | `Password123!` |
| **Student** | Charlie Davis | `student3@eduassess.com` | `Password123!` |

---

## 🧪 Build & Unit Test Verification

To run unit tests and verify production builds:

```bash
# Run Backend Unit Tests (Jest)
cd backend
npm test

# Verify Backend TypeScript Build
cd backend
npm run build

# Verify Frontend Next.js Build
cd frontend
npm run build
```

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for details.
