# Architecture Overview

Intellisoft MediCare uses a modern, decoupled architecture split between a frontend Single Page Application (SPA) and a backend RESTful API.

## 1. Frontend Architecture
**Framework**: React (Vite)
**Styling**: Tailwind CSS v4
**State & Forms**: React Hook Form, Zod validation, Context API (for Toasts & Themes)

### Design Patterns
- **Component-Driven**: UI is built from atomic, reusable components housed in `components/UI.jsx` (Buttons, Cards, Modals, Forms, Skeleton Loaders).
- **Hooks-Based State Management**: Complex logic is encapsulated in custom hooks (e.g., `useDarkMode`, `useToast`).
- **Centralized API Client**: Axios is configured in `api/client.js` with interceptors to gracefully catch backend errors and normalize them for the frontend UI.
- **Client-Side Routing**: `react-router-dom` handles navigation, wrapping all pages in a persistent `DashboardLayout`.

## 2. Backend Architecture
**Framework**: Express.js
**Language**: TypeScript
**Database**: PostgreSQL via Prisma ORM
**Validation**: Zod (at the middleware layer)

### Design Patterns
- **Layered Architecture**: 
  - **Routes**: Define API endpoints and attach middleware.
  - **Controllers**: Extract request data, call services, and send HTTP responses.
  - **Services**: Contain business logic and interact with Prisma.
- **Centralized Error Handling**: Custom `AppError` class and global error middleware catch all synchronous and asynchronous exceptions, returning a standardized JSON structure.
- **Middleware-Driven Validation**: All inbound payloads are intercepted and validated against Zod schemas before hitting controllers.

## 3. Data Flow
1. User interacts with a React Component (e.g., submitting a Vitals form).
2. `react-hook-form` validates input on the client side using Zod.
3. Upon success, Axios sends the payload to the Express Backend.
4. Express routes the request through authentication/validation middleware.
5. Controller delegates business rules (e.g., calculating BMI) to the Service layer.
6. Prisma persists the data in PostgreSQL.
7. Controller sends a normalized response back to the client.
8. React UI updates via state changes (or Toast notifications) based on the response.
