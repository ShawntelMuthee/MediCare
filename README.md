# Patient Management System

A full-stack Patient Management System built with clean architecture principles, featuring a React frontend, Node.js/Express backend, and PostgreSQL database managed via Prisma ORM.

---

## Step-by-Step Implementation Log

1. **Architecture & Folder Structure Planning**
   - Designed scalable monorepo-style separation for [`backend/`](backend/) and [`frontend/`](frontend/).
   - Established RESTful API standardization, routing plans, state management (TanStack Query + Zustand), and validation strategy (Zod + React Hook Form).

2. **Database Schema Design**
   - Designed PostgreSQL relational schema supporting Patients, Vitals, Overweight Assessments, and General Assessments.
   - Implemented Prisma schema definition in [`schema.prisma`](backend/prisma/schema.prisma:1).
   - Created raw SQL DDL script in [`schema.sql`](backend/prisma/schema.sql:1) with foreign key constraints (cascade deletes) and performance indexes.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
