# Job Application Tracking System (ATS) – Backend

A fully functional backend for a multi-tenant **Applicant Tracking System (ATS)** that manages job postings, applications, workflow stages, RBAC, and asynchronous email notifications. This project follows real-world backend architecture and demonstrates clean design, state machine workflow enforcement, and background job processing.

---

## ## 🚀 Features

- User Authentication (JWT)
- Role-based Access Control (Candidate, Recruiter, Hiring Manager)
- Job Management (CRUD)
- Application Submission & History Tracking
- Hiring Workflow State Machine
- Email Notifications using Redis Queue + Worker
- Prisma ORM with PostgreSQL
- Layered Architecture (Routes → Controllers → Services → Prisma)

---

## ## 🏗️ Architecture Overview

```
Client (Postman / Frontend)
        |
        v
+---------------------+
|     Express API     |
+---------------------+
 Controllers
 Services
 Middlewares
        |
        v
+---------------------+
|     Prisma ORM      |
+---------------------+
        |
        v
+---------------------+
|   PostgreSQL DB     |
+---------------------+

Async Processing:
API → BullMQ Queue → Worker → Gmail SMTP
```

---

## ## 🗄️ Entity Relationship Diagram (ERD)

```mermaid
erDiagram

    User {
        int id PK
        string name
        string email
        string password
        string role
        int companyId FK
    }

    Company {
        int id PK
        string name
    }

    Job {
        int id PK
        string title
        string description
        string status
        int companyId FK
        int createdBy
    }

    Application {
        int id PK
        int jobId FK
        int candidateId FK
        string stage
    }

    ApplicationHistory {
        int id PK
        int applicationId FK
        string oldStage
        string newStage
        int changedBy
    }

    Company ||--o{ User : has
    Company ||--o{ Job : posts
    User ||--o{ Application : applies
    Job ||--o{ Application : receives
    Application ||--o{ ApplicationHistory : logs
```

---

## ## 🔄 Workflow / State Machine

```mermaid
stateDiagram-v2
    APPLIED --> SCREENING
    SCREENING --> INTERVIEW
    INTERVIEW --> OFFER
    OFFER --> HIRED

    APPLIED --> REJECTED
    SCREENING --> REJECTED
    INTERVIEW --> REJECTED
    OFFER --> REJECTED
```

Rules:
- Valid sequence: **APPLIED → SCREENING → INTERVIEW → OFFER → HIRED**
- **Rejected** allowed from ANY stage
- Invalid transitions are blocked

---

## ## 🔐 Role-Based Access Control (RBAC)

### RBAC Matrix

| Role            | Register | Login | Apply | My Apps | Create Job | Job Apps | Update Stage | Filter Apps | Company Apps |
|-----------------|----------|-------|-------|---------|------------|----------|--------------|-------------|--------------|
| Candidate       | Yes      | Yes   | Yes   | Yes     | No         | No       | No           | No          | No           |
| Recruiter       | Yes      | Yes   | No    | No      | Yes        | Yes      | Yes          | Yes         | Yes          |
| Hiring Manager  | Yes      | Yes   | No    | No      | No         | Yes      | No           | Yes         | Yes          |

---

## ## 📡 API Endpoints

---

## **Authentication**

### **POST /auth/register**

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "1234",
  "role": "CANDIDATE",
  "companyId": 1
}
```

### **POST /auth/login**

Returns JWT token:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR..." }
```

---

## **Jobs (Recruiter Only)**

### **POST /jobs/create**
```
Authorization: Bearer <recruiter_token>
```

```json
{
  "title": "Backend Engineer",
  "description": "Node.js role"
}
```

### **GET /jobs**
Public.

### **GET /jobs/:id**
Public.

---

## **Applications – Candidate**

### **POST /applications/apply/:jobId**

```
Authorization: Bearer <candidate_token>
```

### **GET /applications/my-applications**

```
Authorization: Bearer <candidate_token>
```

Returns applications + history.

---

## **Applications – Recruiter**

### **PUT /applications/stage/:id**

```
Authorization: Bearer <recruiter_token>
```

Body:

```json
{ "stage": "INTERVIEW" }
```

### **GET /applications/job/:jobId**

```
Authorization: Bearer <recruiter_token>
```

### **GET /applications/job/:jobId/filter?stage=SCREENING**

---

## ## 📬 Email Notification System

Emails sent when:

- Candidate applies for a job  
- Application stage is updated  

Queue Flow:

```
API → BullMQ Queue → Worker → Gmail SMTP → User
```

---

## ## ⚙️ Environment Variables

Create `.env`:

```
DATABASE_URL=postgresql://postgres:1234@localhost:5432/ats_db?schema=public
JWT_SECRET=secret123
REDIS_URL=redis://127.0.0.1:6379

EMAIL_FROM=yourgmail@gmail.com
EMAIL_PASS=your_app_password
```

---

## ## 🛠️ Installation & Setup

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Run migrations

```
npx prisma migrate dev
```

### 3️⃣ Start Redis (Docker)

```
docker run -p 6379:6379 redis
```

### 4️⃣ Start the API server

```
npm run dev
```

### 5️⃣ Start the Email Worker

```
node src/workers/emailWorker.js
```

---

## ## 🧪 Testing Instructions

Use Postman / Thunder Client:

### Candidate:
- Register  
- Login → get token  
- Apply to job  

### Recruiter:
- Register  
- Login → token  
- Create job  
- View applications  
- Change stage  

Worker terminal should show:

```
Email sent: user@gmail.com
```

---

## ## 🎥 Video Demonstration Must Include

1. Register Candidate  
2. Register Recruiter  
3. Recruiter creates job  
4. Candidate applies  
5. Email worker prints notification  
6. Recruiter views applications  
7. Recruiter updates stage  
8. Email worker prints stage update  
9. Show README.md in repo  

---

## ## 📂 Folder Structure

```
src/
 ├── controllers/
 ├── services/
 ├── middlewares/
 ├── routes/
 ├── queue/
 ├── workers/
 ├── prisma/
```

---

## ## 🧑‍💻 Tech Stack

- Node.js  
- Express  
- PostgreSQL  
- Prisma ORM  
- Redis  
- BullMQ  
- Nodemailer  
- JWT  

---

## ## 🏁 Conclusion

This ATS backend demonstrates real backend engineering skills including workflow automation, role-based access, clean architecture, and asynchronous event-driven processing. Suitable for real-world systems and portfolio projects.

---

# 🎉 End of README.md  
