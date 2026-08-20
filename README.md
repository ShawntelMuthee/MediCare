# Intellisoft Medicare - Patient Management System

A production-ready, full-stack Patient Management System designed with clean architecture principles, modern SaaS healthcare aesthetics, and robust type safety.

---

## Architecture Overview

- **Frontend**: React + Vite + Tailwind CSS (Supports dark mode, toast notifications, skeleton loaders, and accessible form validations).
- **Backend**: Node.js + Express + TypeScript following clean controller-service-repository patterns.
- **Database**: PostgreSQL managed via Prisma ORM with strict referential integrity and performance indexing.
- **Validation**: Zod schema validation on both client and server layers.

---

## Environment Variables

### Backend ([`backend/.env`](backend/.env:1))
```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/medicare?schema=public"
```

### Frontend ([`frontend/.env`](frontend/.env:1))
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Setup Instructions

### 1. Database & Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init_medicare
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## API Documentation

| Endpoint | Method | Description |
|---|---|---|
| [`/patients`](backend/src/routes/patient.routes.ts:1) | `POST` | Register a new patient (with duplicate prevention) |
| [`/patients`](backend/src/routes/patient.routes.ts:1) | `GET` | List all registered patients with recent vitals |
| [`/patients/report`](backend/src/routes/patient.routes.ts:1) | `GET` | Retrieve dashboard statistics and recent registrations |
| [`/patients/:id`](backend/src/routes/patient.routes.ts:1) | `GET` | Retrieve patient profile with complete clinical history |
| [`/patients/:id/vitals`](backend/src/routes/vitals.routes.ts:1) | `POST` | Record patient vitals, calculate BMI, and get routing suggestions |
| [`/patients/:id/vitals`](backend/src/routes/vitals.routes.ts:1) | `GET` | Fetch all vitals history for a patient |
| [`/patients/:id/overweight-assessments`](backend/src/routes/assessment.routes.ts:1) | `POST` | Submit overweight assessment record |
| [`/patients/:id/general-assessments`](backend/src/routes/assessment.routes.ts:1) | `POST` | Submit general health assessment record |

---

## Features & Enhancements
- **Dark Mode**: Seamless toggle for low-light clinical environments.
- **Dashboard Statistics Cards**: Real-time metrics overview for total patients and clinical flow.
- **Patient Profile Page**: Comprehensive timeline of clinical history, vitals, and assessments.
- **Toast Notifications & Skeleton Loaders**: Polished UX feedback and loading states.
- **BMI Routing Engine**: Automatic BMI calculation with conditional routing to Overweight or General Assessments.
