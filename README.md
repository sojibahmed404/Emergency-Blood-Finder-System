# 🩸 Emergency Blood Finder System v2.1

A full-stack web application to find blood donors in emergency situations, built with React.js + Tailwind CSS (frontend) and Supabase Edge Functions + PostgreSQL (backend).

---

## 🛠️ Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS v3 |
| Backend   | Supabase Edge Functions    |
| Database  | PostgreSQL (Supabase)    |
| Auth      | JWT (jose)              |
| Security  | Edge Function role checks |

---

## 🎯 Features

- ✅ JWT Authentication (Register / Login / Logout)
- ✅ Role-based access: **ADMIN**, **DONOR**, **RECEIVER**
- ✅ Donor Management (create/update profile, availability toggle)
- ✅ Search Donors (filter by blood group + location)
- ✅ Blood Bank Module (full CRUD, admin-managed)
- ✅ Blood Request System (Receiver → Donor → Accept/Reject)
- ✅ Admin Panel (user management, stats, block/unblock/delete)
- ✅ 37 real donors pre-seeded
- ✅ 10 blood banks in Sirajganj district pre-seeded
- ✅ Responsive dark UI with Tailwind CSS
- ✅ Loading spinners, toast notifications, animated transitions

---

## � Developer Team

- **Team Member 2:** Anamika Jahan
- **Team Member 3:** Annana Khandakar

---

## �📋 Prerequisites

- **Node.js 18+** (check: `node -v`)
- A Supabase project and the Supabase CLI
- Java 21+ and Maven only if using the legacy Spring Boot backend locally

---

## 🗄️ Supabase Database Setup

1. Create a Supabase project and open **SQL Editor**.
2. Run [`database/supabase-schema.sql`](./database/supabase-schema.sql).
3. For a new project using the included starter dataset, run [`database/supabase-seed.sql`](./database/supabase-seed.sql) once. If preserving an existing Render/MySQL database, import that export instead; do not seed on top of existing records. Import in this order: `users`, `donors`, `blood_banks`, `requests`, preserving IDs, timestamps, and password hashes. Do not remove the old database before verifying imported data.
4. After importing existing IDs, run [`database/supabase-reset-sequences.sql`](./database/supabase-reset-sequences.sql).
5. In **Edge Functions → Secrets**, set `JWT_SECRET` to a private random secret at least 32 characters long. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions automatically. Never put the service-role key in the frontend or Vercel.
6. Deploy the Edge Function from the repository root:
   ```bash
   supabase functions deploy api --no-verify-jwt
   ```
   `verify_jwt` is disabled because this project uses its own JWT. The function validates that token and the user's role itself.
7. In Vercel, add `VITE_SUPABASE_URL` (the project URL) and `VITE_SUPABASE_ANON_KEY` (the public anon/publishable key), then redeploy the frontend.
8. Test donor search, login, registration, requests, and admin actions on the live site. Only after these pass should you remove the old Render backend/database.

Compare these counts in Supabase against the old database before switching traffic:
```sql
SELECT COUNT(*) FROM public.users;
SELECT COUNT(*) FROM public.donors;
SELECT COUNT(*) FROM public.blood_banks;
SELECT COUNT(*) FROM public.requests;
```

The tables have row-level security enabled. The browser only calls the Edge Function; its service-role key is server-side and must never be exposed publicly.

### Default Credentials

| Role    | Email                       | Password  |
|---------|-----------------------------|-----------|
| Admin   | admin@bloodfinder.com       | admin123  |
| Donors  | (any seeded email)          | donor123  |

**Example donor login:** `rakibul19980101@gmail.com` / `donor123`

These are the original seed credentials if those seed accounts exist in the imported database. Existing password hashes are preserved.

---

## ⚙️ Edge Function Setup

The live API is the Supabase Edge Function in `supabase/functions/api`. Install the [Supabase CLI](https://supabase.com/docs/guides/cli), create a Supabase project, and follow the setup steps above. The legacy Spring Boot backend under `backend/` is not used by the Vercel production site.

---

## 🎨 Frontend Setup

1. Navigate to the frontend folder:
```bash
cd project2.1/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app opens at **http://localhost:5173**

---

## 🚀 Running Locally

Run the frontend locally:
```bash
cd frontend
npm run dev
```

Copy `frontend/.env.example` to `frontend/.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to use the deployed Supabase Edge Function. Keep the Supabase service-role key and `JWT_SECRET` only in Edge Function secrets; never put them in the frontend.

---

## 🔗 API Endpoints

### Auth (Public)
```
POST /api/auth/register   — Register new user
POST /api/auth/login      — Login and get JWT
```

### Donors (Public GET, Protected POST)
```
GET  /api/donors                                       — All donors
GET  /api/donors/search?bloodGroup=A%2B&location=Dhaka — Search
GET  /api/donors/{id}                                  — Single donor
GET  /api/donors/me                                    — My profile (DONOR)
POST /api/donors/profile                               — Save profile (DONOR)
```

### Blood Banks (Public GET, Admin POST/PUT/DELETE)
```
GET    /api/bloodbanks             — All blood banks
GET    /api/bloodbanks?location=x  — Filter by location
GET    /api/bloodbanks/{id}        — Single blood bank
POST   /api/bloodbanks             — Create (ADMIN)
PUT    /api/bloodbanks/{id}        — Update (ADMIN)
DELETE /api/bloodbanks/{id}        — Delete (ADMIN)
```

### Requests (Authenticated)
```
POST /api/requests                 — Send blood request (RECEIVER)
GET  /api/requests/mine            — My sent requests (RECEIVER)
GET  /api/requests/incoming        — Incoming requests (DONOR)
PUT  /api/requests/{id}/status     — Accept/Reject (DONOR)
```

### Admin (ADMIN only)
```
GET    /api/admin/stats              — System statistics
GET    /api/admin/users              — All users
PUT    /api/admin/users/{id}/block   — Toggle block
DELETE /api/admin/users/{id}         — Delete user
```

---

## 📁 Project Structure

```
project2.1/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/bloodfinder/
│       ├── BloodFinderApplication.java
│       ├── config/
│       │   ├── CorsConfig.java
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── BloodBankController.java
│       │   ├── DonorController.java
│       │   ├── RequestController.java
│       │   └── AdminController.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── BloodBankService.java
│       │   ├── DonorService.java
│       │   ├── RequestService.java
│       │   └── AdminService.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── DonorRepository.java
│       │   ├── BloodBankRepository.java
│       │   └── RequestRepository.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Donor.java
│       │   ├── BloodBank.java
│       │   └── Request.java
│       ├── dto/ (7 DTO classes)
│       └── security/
│           ├── JwtUtil.java
│           ├── JwtFilter.java
│           └── UserDetailsServiceImpl.java
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DonorCard.jsx
│   │   │   ├── BloodBankCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RequestModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── DonorProfile.jsx
│   │   │   ├── BloodBanksPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   └── services/
│   │       ├── api.js
│   │       ├── authService.js
│   │       ├── donorService.js
│   │       ├── bloodBankService.js
│   │       ├── requestService.js
│   │       └── adminService.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── database/
    ├── schema.sql
    ├── supabase-schema.sql
    └── supabase-reset-sequences.sql
```

---

## 🔧 Configuration

### Set the database connection
Set the `DB_URL`, `DB_USER`, and `DB_PASS` environment variables for your PostgreSQL database. Never commit production credentials.


### Change JWT Secret (for production)
```properties
app.jwt.secret=YOUR_VERY_LONG_RANDOM_SECRET_KEY
```

---

## 🧪 Quick Test

After starting both services, test the API:

```bash
# Login as admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bloodfinder.com","password":"admin123"}'

# Get all donors (public)
curl http://localhost:8080/api/donors

# Search by blood group
curl "http://localhost:8080/api/donors/search?bloodGroup=O%2B&location=Belkuchi"
```
