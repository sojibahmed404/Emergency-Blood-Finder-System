# 🩸 Emergency Blood Finder System v2.1

A full-stack web application to find blood donors in emergency situations, built with React.js + Tailwind CSS (frontend) and Java Spring Boot + MySQL (backend).

---

## 🛠️ Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS v3 |
| Backend   | Java 17 + Spring Boot 3.2.4 |
| Database  | MySQL 8.0                |
| Auth      | JWT (jjwt 0.11.5)        |
| Security  | Spring Security 6        |

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

## 📋 Prerequisites

- **Java 17+** (check: `java -version`)
- **Maven 3.8+** (check: `mvn -version`)
- **Node.js 18+** (check: `node -v`)
- **MySQL 8.0+** running on port 3306

---

## 🗄️ Database Setup

1. Open MySQL and run the schema file:

```sql
-- In MySQL Workbench, DBeaver, or CLI:
SOURCE C:/Users/user/Desktop/project2.1/database/schema.sql;
```

Or via CLI:
```bash
mysql -u root -p < database/schema.sql
```

2. Verify the database:
```sql
USE blood_finder_db;
SELECT COUNT(*) FROM users;   -- Should be 38 (1 admin + 37 donors)
SELECT COUNT(*) FROM donors;  -- Should be 37
SELECT COUNT(*) FROM blood_banks; -- Should be 10
```

### Default Credentials

| Role    | Email                       | Password  |
|---------|-----------------------------|-----------|
| Admin   | admin@bloodfinder.com       | admin123  |
| Donors  | (any seeded email)          | donor123  |

**Example donor login:** `rakibul19980101@gmail.com` / `donor123`

---

## ⚙️ Backend Setup

1. Navigate to the backend folder:
```bash
cd project2.1/backend
```

2. Configure database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

3. Run the backend:
```bash

```

Or build and run the JAR:
```bash
mvn clean package -DskipTests
java -jar target/blood-finder-backend-2.1.0.jar
```

The API starts at **http://localhost:8080**

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

## 🚀 Running Both Together

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd project2.1/backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd project2.1/frontend
npm run dev
```

Open **http://localhost:5174** in your browser.

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
    └── schema.sql
```

---

## 🔧 Configuration

### Change MySQL Password
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

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
