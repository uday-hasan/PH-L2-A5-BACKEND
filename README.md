````md
# ⚙️ Planora - Backend API

The core engine for **Planora**, a robust Event Management System. This RESTful API handles authentication, database orchestration via Prisma, and complex event participation workflows.

## 🔗 Deployment Links

- **Base API URL:** https://api-planora.udayhasan.dev
- **Frontend App:** https://planora.udayhasan.dev

---

## 🛠️ Technology Stack

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Payment Gateway:** Stripe

---

## 🚀 Core Functionalities

- **User Management:** Secure signup, login, and Role-Based Access Control (RBAC).
- **Event CRUD:** Complete Create, Read, Update, and Delete operations for events.
- **Participation Logic:**
  - **Free Public:** Instant join.
  - **Paid Public:** Pending status until payment confirmation.
  - **Private Events:** Host approval workflow.
- **Invitation System:** Host-to-user invitation logic.
- **Review System:** CRUD for event ratings and reviews.
- **Admin Moderation:** Global monitoring of users and events.

---

## 🏗️ Database Schema (Prisma)

### Key Models

- `User`: Handles credentials, roles (User/Admin), and profiles.
- `Event`: Stores title, description, venue, fee, and host details.
- `Request`: Tracks join requests, payments, and approval statuses.
- `Review`: Stores user ratings and feedback.

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/uday-hasan/PH-L2-A5-BACKEND.git
cd PH-L2-A5-BACKEND
```
````

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Database (required for prisma.config.ts in Prisma v7)
DATABASE_URL="DB_URL"

# JWT
JWT_SECRET="change-this-to-a-random-32-char-secret"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="STRIPE_SECRET"
STRIPE_WEBHOOK_SECRET="STRIPE_WEBHOOK_SECRET"

# App
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:3000"
COOKIE_DOMAIN=".DOMAIN.EXTENSION"
```

### 4. Run database migrations and generate Prisma client

```bash
bunx prisma migrate dev
bunx prisma generate
```

### 5. Start the development server

```bash
bun run dev
```

```

```
