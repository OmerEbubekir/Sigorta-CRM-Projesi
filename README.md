# 🛡️ SigortaCRM - SaaS Insurance Agency Management System

![Project Banner](./frontend/public/dashboard-screen.png)

> **SigortaCRM** is a high-performance, secure, and scalable SaaS platform designed for insurance agencies. It features a robust multi-tenancy architecture, real-time analytics, and advanced security measures including IP banning and Redis-based rate limiting.

---

## 🚀 Key Features

### 👑 Admin & Agency Portals
- **Role-Based Access Control (RBAC):** Distinct dashboards for **Super Admins** and **Agencies**.
- **Admin Panel:** Monitor system logs, view all agencies, and **ban/unban** accounts with one click.
- **Agency Dashboard:** Real-time financial reports, policy tracking, and customer management.

### 🛡️ Advanced Security (Enterprise Grade)
- **Double Token Architecture:** Short-lived **Access Tokens** (15m) and **HttpOnly Refresh Tokens** (7d) to prevent XSS attacks.
- **Redis Blacklisting:** Instant token revocation upon logout or ban.
- **Brute-Force Protection:** Auto-ban mechanism for repeated failed login attempts.
- **Rate Limiting:** Request throttling to prevent DDoS attacks.
- **IP Blocking:** Middleware to block malicious IP addresses at the gate.

### 📊 Data & Reporting
- **Dynamic Filtering:** Filter by Date Range, Policy Type, and Status (Active/Cancelled).
- **Monthly Performance:** Instant monthly revenue and production analysis.
- **Smart Alerts:** Color-coded expiration warnings (Green/Yellow/Red).
- **Excel Export:** Detailed report generation with a single click.

---

## 📡 API Documentation

The backend provides a comprehensive RESTful API. Below is a list of available endpoints.

### 🔐 Authentication (Agency)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/agency/register` | Register a new agency account. | ❌ |
| `POST` | `/api/agency/login` | Login and receive Access/Refresh tokens. | ❌ |
| `POST` | `/api/agency/refresh-token` | Get a new Access Token using Refresh Token. | ❌ |
| `POST` | `/api/agency/logout` | Logout and invalidate tokens (Redis Blacklist). | ❌ |
| `POST` | `/api/agency/verify-email` | Verify email address with token. | ❌ |
| `POST` | `/api/agency/resend-verification` | Resend the verification email. | ❌ |
| `POST` | `/api/agency/forgot-password` | Request a password reset link. | ❌ |
| `POST` | `/api/agency/reset-password` | Reset password with provided token. | ❌ |

### 📊 Dashboard & Analytics

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard` | Get summary stats (Total policies, revenue, etc.). | ✅ |
| `GET` | `/api/dashboard/monthly` | Get specific monthly performance data. | ✅ |

### 📄 Policy Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/policy` | List all policies (Supports pagination & filtering). | ✅ |
| `GET` | `/api/policy/:id` | Get details of a single policy. | ✅ |
| `POST` | `/api/policy` | Create a new policy record. | ✅ |
| `PUT` | `/api/policy/:id` | Update an existing policy. | ✅ |
| `DELETE` | `/api/policy/:id` | Delete a policy. | ✅ |

### 👥 Customer Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/customer` | Create a new customer. | ✅ |
| `GET` | `/api/customer` | List all customers for the agency. | ✅ |

### 👑 Super Admin

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/admin/agencies` | List all registered agencies. | ✅ (Admin) |
| `GET` | `/api/admin/logs` | View system audit logs. | ✅ (Admin) |
| `PATCH` | `/api/admin/agency/:id/toggle` | Ban or Unban an agency. | ✅ (Admin) |

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)**, TypeScript, Tailwind CSS, Axios, React Hot Toast |
| **Backend** | **Node.js**, Express.js, TypeScript |
| **Database** | **PostgreSQL**, Prisma ORM |
| **Caching & Pub/Sub** | **Redis** (Docker / Upstash) |
| **Auth & Security** | JWT (RS256), Bcrypt, Cookie-Parser, Helmet, Express-Rate-Limit |
| **DevOps** | Docker, Git |

---

## ⚡ Getting Started

### 1. Prerequisites
* Node.js (v18+)
* Docker (For Redis & Postgres) or Local Installs

### 2. Installation 

Clone the repo:
```bash
git clone [https://github.com/OmerEbubekir/Sigorta-CRM.git](https://github.com/OmerEbubekir/Sigorta-CRM.git)

Backend Setup:
cd backend
npm install
# Create .env file with DATABASE_URL, REDIS_URL, JWT_SECRET
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts # Populate DB with dummy data
npm run dev

Frontend Setup:
cd frontend
npm install
npm run dev