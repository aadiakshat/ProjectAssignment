# Finance Data Processing and Access Control Backend

A full-stack finance dashboard application built with Node.js, Express, MongoDB, and React. The system supports role-based access control, financial record management, dashboard analytics, and user administration.

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Backend    | Node.js, Express.js                           |
| Database   | MongoDB with Mongoose ODM                     |
| Auth       | JWT (JSON Web Tokens), bcrypt                 |
| Validation | express-validator                             |
| Frontend   | React 19, React Router, Vite                  |
| Styling    | Vanilla CSS (custom design system)            |
| Security   | Helmet, CORS, express-rate-limit              |

---

## Project Structure

```
.
├── Server/
│   └── src/
│       ├── config/
│       │   ├── db.js                  # MongoDB connection setup
│       │   └── roles.js               # Role and permission definitions
│       ├── controllers/
│       │   ├── userController.js       # Auth and user management handlers
│       │   ├── recordController.js     # Financial record CRUD handlers
│       │   └── dashboardController.js  # Analytics endpoint handlers
│       ├── middlewares/
│       │   ├── authenticate.js         # JWT token verification
│       │   ├── authorize.js            # Permission-based access checks
│       │   ├── validate.js             # Request validation wrapper
│       │   └── errorHandler.js         # Global error handler
│       ├── models/
│       │   ├── User.js                 # User schema with password hashing
│       │   └── Record.js              # Financial record schema
│       ├── routes/
│       │   ├── userRoutes.js           # /api/users endpoints
│       │   ├── recordRoutes.js         # /api/records endpoints
│       │   └── dashboardRoutes.js      # /api/dashboard endpoints
│       ├── services/
│       │   ├── userService.js          # User business logic
│       │   ├── recordService.js        # Record CRUD and filtering logic
│       │   └── dashboardService.js     # Aggregation pipelines for analytics
│       ├── validators/
│       │   └── index.js                # Validation rules for all endpoints
│       ├── seed.js                     # Database seeder with sample data
│       └── server.js                   # Express app entry point
│
├── client/
│   └── src/
│       ├── components/
│       │   └── Layout.jsx              # App shell with sidebar navigation
│       ├── context/
│       │   └── AuthContext.jsx          # Authentication state management
│       ├── pages/
│       │   ├── Login.jsx               # Login form
│       │   ├── Dashboard.jsx           # Stats, charts, recent activity
│       │   ├── Records.jsx             # Record table with CRUD and filters
│       │   └── Users.jsx               # User management (admin only)
│       ├── api.js                      # Centralized API client
│       ├── App.jsx                     # Routing and protected routes
│       ├── main.jsx                    # React entry point
│       └── index.css                   # Design system and all styles
│
├── .env                                # Environment variables
├── .gitignore
├── package.json                        # Backend dependencies and scripts
└── README.md
```

---

## Setup and Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB (local instance or cloud like MongoDB Atlas)

### 1. Clone and install

```bash
git clone <repo-url>
cd assignment

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Seed the database

```bash
npm run seed
```

This creates three test users and 30 sample financial records.

### 4. Start the application

Open two terminal windows:

```bash
# Terminal 1 — Backend (port 5000)
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in the browser.

---

## Seed Accounts

| Email               | Password    | Role    |
|---------------------|-------------|---------|
| admin@example.com   | admin123    | admin   |
| analyst@example.com | analyst123  | analyst |
| viewer@example.com  | viewer123   | viewer  |

---

## Roles and Permissions

Access control is permission-based. Each role maps to a set of permissions, and the `authorize` middleware checks whether the requesting user's role includes the required permission.

| Permission       | Viewer | Analyst | Admin |
|------------------|--------|---------|-------|
| read:records     | ✓      | ✓       | ✓     |
| read:dashboard   | ✓      | ✓       | ✓     |
| read:insights    |        | ✓       | ✓     |
| write:records    |        |         | ✓     |
| delete:records   |        |         | ✓     |
| manage:users     |        |         | ✓     |

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description           | Auth Required |
|--------|----------------------|-----------------------|---------------|
| POST   | /api/users/register  | Register a new user   | No            |
| POST   | /api/users/login     | Login and get token   | No            |
| GET    | /api/users/me        | Get current profile   | Yes           |

### User Management (Admin only)

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | /api/users         | List all users            |
| GET    | /api/users/:id     | Get user by ID            |
| PATCH  | /api/users/:id     | Update user role/status   |

### Financial Records

| Method | Endpoint            | Description            | Minimum Role |
|--------|---------------------|------------------------|--------------|
| GET    | /api/records        | List records (filtered)| Viewer       |
| GET    | /api/records/:id    | Get single record      | Viewer       |
| POST   | /api/records        | Create a record        | Admin        |
| PATCH  | /api/records/:id    | Update a record        | Admin        |
| DELETE | /api/records/:id    | Soft delete a record   | Admin        |

#### Query Parameters for GET /api/records

| Parameter   | Type   | Description                           |
|-------------|--------|---------------------------------------|
| type        | string | Filter by `income` or `expense`       |
| category    | string | Filter by category (partial match)    |
| startDate   | string | Filter records from this date (ISO)   |
| endDate     | string | Filter records until this date (ISO)  |
| minAmount   | number | Minimum amount filter                 |
| maxAmount   | number | Maximum amount filter                 |
| page        | number | Page number (default: 1)              |
| limit       | number | Records per page (default: 20)        |

### Dashboard Analytics

| Method | Endpoint                  | Description                         |
|--------|---------------------------|-------------------------------------|
| GET    | /api/dashboard/summary    | Total income, expenses, net balance |
| GET    | /api/dashboard/categories | Category-wise breakdown             |
| GET    | /api/dashboard/trends     | Monthly income vs expense trends    |
| GET    | /api/dashboard/recent     | Recent activity feed                |

### Health Check

| Method | Endpoint     | Description        |
|--------|--------------|--------------------|
| GET    | /api/health  | Server status      |

---

## Frontend Pages

**Login** — Email and password authentication. Tokens are stored in localStorage and sent with every API request.

**Dashboard** — Displays four summary stat cards (total income, total expenses, net balance, record count), a horizontal bar chart for category-wise breakdown, a vertical bar chart for monthly income/expense trends, and a recent activity feed with the latest transactions.

**Records** — Paginated table of all financial records with type and category filters. Admins see a "New Record" button and Edit/Delete actions on each row. Non-admin users see the table in read-only mode.

**Users (Admin only)** — Table of all registered users. Admins can change a user's role via a dropdown and toggle their active/inactive status. This page is hidden from non-admin users in the sidebar and protected at the route level.

---

## Sample API Requests

```bash
# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Create a financial record
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount": 2500, "type": "income", "category": "Salary", "description": "March salary"}'

# Get filtered records
curl "http://localhost:5000/api/records?type=expense&category=Rent&page=1&limit=10" \
  -H "Authorization: Bearer <token>"

# Dashboard summary
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <token>"
```

---

## Design Decisions

**Service Layer Pattern** — Business logic lives in service files, not controllers. Controllers are thin and only handle request/response formatting. This keeps the logic testable and the codebase easy to navigate.

**Permission-Based Authorization** — Instead of checking `if (role === "admin")` in every route, each role maps to a list of permissions in `config/roles.js`. The `authorize` middleware accepts required permissions as arguments and checks them against the user's role. Adding a new role or changing what a role can do requires editing one file instead of touching every route.

**Soft Deletes** — Deleting a record sets `isDeleted: true` instead of removing it from the database. All queries filter out deleted records. This preserves data integrity and makes it possible to recover accidentally deleted entries.

**Aggregation Pipelines** — Dashboard endpoints use MongoDB's aggregation framework to compute totals, breakdowns, and trends at the database level. This avoids loading all records into application memory and scales better with larger datasets.

**Centralized API Client** — The frontend has a single `api.js` module that handles token attachment, error extraction, and base URL configuration. Every component calls this module instead of using `fetch` directly, which keeps API interaction consistent.

**Role-Aware UI** — The frontend checks the user's role from the auth context and conditionally renders navigation links and action buttons. Non-admin users cannot see the Users page link or record mutation buttons, and even if they navigate to `/users` directly, a route guard redirects them.

---

## Error Handling

All error responses use consistent HTTP status codes:

| Code | Meaning                            |
|------|------------------------------------|
| 200  | Success                            |
| 201  | Resource created                   |
| 400  | Validation error or bad request    |
| 401  | Missing or invalid token           |
| 403  | Insufficient permissions           |
| 404  | Resource not found                 |
| 409  | Duplicate entry                    |
| 429  | Rate limit exceeded                |
| 500  | Internal server error              |

Error response format:

```json
{
  "error": "Description of what went wrong"
}
```

Validation errors include field-level details:

```json
{
  "errors": [
    { "field": "email", "message": "Valid email is required" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

---

## Assumptions

- MongoDB is expected to be running locally on port 27017. For a remote instance, update `MONGO_URI` in the `.env` file.
- The JWT secret in `.env` is for development purposes. In production, this should be a strong random string.
- The seed script wipes existing data before inserting fresh records. It should only be used during initial setup or to reset the database.
- CORS is open to all origins for local development. In production, it should be restricted to the frontend's domain.
- Rate limiting is set to 500 requests per 15-minute window per IP for all `/api` routes.
- Passwords are hashed with bcrypt (12 salt rounds) before storage. Raw passwords are never persisted or returned in API responses.
