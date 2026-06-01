# Task Management System

A full-stack web-based Task Management System built with ASP.NET Core and React.js. This application allows users to organize, track, and manage tasks efficiently with role-based access, logging, and robust backend architecture.

---

## Features

### Authentication & Authorization
- User registration and login
- Role-based access control (Admin, Regular User)
- Secure authentication

### Task Management
- Create, Read, Update, Delete (CRUD) tasks
- Assign tasks to users
- Set task priorities
- Add due dates
- Track task status (Pending, In Progress, Completed)

### Dashboard
- Displays:
  - Completed Tasks
  - In Progress Tasks
  - Pending Tasks
- Admin users can view all tasks
- Regular users see only their tasks

### Task Modules
- Task List with filters
- Task Detail view
- Create / Update Task

### User Profile
- View user information
- Logout functionality

---

## Technology Stack

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

## Architecture Overview

- React frontend communicates with ASP.NET Core Web API
- Entity Framework Core handles database operations
- SQL Server stores application data
- Serilog manages structured logging
- Global exception middleware handles errors

---

## Setup

To set up your development enviroment for TaskMaster, follow these steps:

1. Clone the repository.
```bash
git clone https://github.com/Aleem-27/taskmaster
```

2. Open the root folder in Visual Studio Code and navigate to the `client` folder.
```bash
cd client
```

3. Download and install the required libraries in the `client` folder.
```bash
npm install
```

> [!WARNING]
> If it finds any high severity issue, use `npm audit fix` to resolve it

4. Create an `.env` file in the root folder and add the JWT secret key there.
```env
JWT_SECRET=replace-with-a-long-random-base64-secret
```

> [!NOTE]
> You can generate a base64 secret using the following command in PowerShell terminal.
> ```bash
> $bytes = New-Object byte[] 64; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)
> ```

5. Now, open `Visual Studio Community` and open the solution file located in `/taskmaster/server/taskmaster.api/`.
6. Edit the database connection string in `appsettings.json` and `appsettings.Development.json` files.
```json
"DefaultConnection": "Server=replace-with-your-server-name;Database=TaskMasterDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```

> [!NOTE]
> To get your server name, open `SQL Server Management Studio` navigate to File > Connect Object Explorer and copy `Server Name`.

7. Apply migrations to you database.
```cs
dotnet ef database update
```

You now have everything you need to compile, develop and run the project. However, make sure the server is running prior to running the client.

### Server
Use `dotnet run` to run the server or just click the green `play` button if you're using Visual Studio Community.

### Client
Use `npm run dev` in Visual Studio Code or any IDE of your choice.
