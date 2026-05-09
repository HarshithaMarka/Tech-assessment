# Team Task Manager

A full-stack Team Task Management application built to help teams organize projects, assign tasks, and track progress via a dynamic Kanban board.

## Tech Stack
* **Frontend:** React, Vite, React Router DOM, Axios
* **Backend:** Java 17, Spring Boot 3.2, Spring Security, JWT
* **Database:** H2 In-Memory Database (Prepared for PostgreSQL in production)

## Features
* **Role-Based Access Control (RBAC):** Distinct `ADMIN` and `MEMBER` roles.
* **JWT Authentication:** Stateless, secure authentication strategy.
* **Kanban Board:** Visually track tasks moving from "To Do" to "In Progress" to "Done".
* **Dashboard Analytics:** Live statistics on pending, completed, and overdue tasks.
* **Admin Controls:** Admins can create projects and assign tasks to specific team members.
* **Member Controls:** Members can create their own tasks, update their task status, and manage their assigned work.

## Getting Started Locally

### Prerequisites
* Java 17+
* Maven 3.8+
* Node.js 18+

### 1. Run the Backend (Spring Boot)
Open a terminal in the `Tech-assessment` directory and run:
```bash
cd Tech-assessment
mvn spring-boot:run
```
The backend server will start at `http://localhost:8080`.

### 2. Run the Frontend (React Vite)
Open a new terminal in the `frontend` directory and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend UI will start at `http://localhost:5173`.

## Default Credentials
When the backend starts, the H2 database is wiped clean. You must click **Sign Up** to create an initial account before logging in. 
During Sign Up, you can choose whether your role is `MEMBER` or `ADMIN`.

## API Endpoints
* `POST /auth/register` - Create a new user account
* `POST /auth/login` - Authenticate and receive JWT token
* `GET /users` - Fetch all registered team members
* `POST /projects` - Create a new project (Admin Only)
* `GET /projects` - Fetch all projects
* `POST /tasks` - Create a task
* `GET /tasks` - Fetch all tasks
* `PUT /tasks/{id}` - Update task status
* `DELETE /tasks/{id}` - Delete a task (Admin Only)
