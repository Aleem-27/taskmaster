# Task Management System

A full-stack web-based Task Management System built with ASP.NET Core and React.js. This application allows users to organize, track, and manage tasks efficiently with role-based access, logging, and robust backend architecture.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access control (Admin, Regular User)
- Secure authentication

### ✅ Task Management
- Create, Read, Update, Delete (CRUD) tasks
- Assign tasks to users
- Set task priorities
- Categorize tasks
- Add due dates
- Track task status (Pending, In Progress, Completed)

### 📊 Dashboard
- Displays:
  - Completed Tasks
  - In Progress Tasks
  - Pending Tasks
- Admin users can view all tasks
- Regular users see only their tasks

### 📋 Task Modules
- Task List with filters
- Task Detail view
- Create / Update Task

### 👤 User Profile
- View user information
- Logout functionality

---

## 🧰 Technology Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Serilog (Logging)
- xUnit (Unit Testing)

### Frontend
- React.js
- Axios / Fetch API

### Tools & DevOps
- Git (Version Control)
- SonarQube (Code Quality Analysis)

---

## 🏗️ Architecture Overview

- React frontend communicates with ASP.NET Core Web API
- Entity Framework Core handles database operations
- SQL Server stores application data
- Serilog manages structured logging
- Global exception middleware handles errors

---

## 🗄️ Database Design

### Main Entities
- Users
- Roles
- Tasks
- TaskCategories

### Relationships
- A user can have multiple tasks
- Tasks are assigned to users
- Tasks belong to categories
