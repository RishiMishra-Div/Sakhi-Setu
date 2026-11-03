# 🌸 SakhiSetu (सखीसेतू)
### Digital Management System for Mahila Bachat Gat (SHG)
> *"Empowering Women Through Savings, Unity and Digital Records"*

---

## 📌 Project Overview
**SakhiSetu** is a full-stack MERN (MongoDB, Express.js, React JSX, Node.js) web application developed as a Community Engagement Project (CEP) for Mahila Bachat Gats (Women's Self-Help Groups - SHG). It replaces manual paper registers with an intuitive, mobile-first, and bilingual (Marathi, Hindi & English) digital record keeping system for meetings, attendance, savings, loans, announcements, products showcase, and monthly audit reports.

---

## 🛠️ Technology Stack
- **Database**: MongoDB with Mongoose ODM (Relational schema, aggregations, compound unique indexes)
- **Backend**: Node.js & Express.js (REST API, JWT Authentication, RBAC, Data sanitization)
- **Frontend**: React.js with `.jsx` components, built using Vite
- **Styling**: Vanilla CSS Design System with calm green-and-white theme, glassmorphism, responsive grid & print media stylesheets
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Noto Sans Devanagari*)

---

## 🚀 Key Features Implemented

1. **Public Showcase & Landing Page**
   - Mission statement & Mahila Bachat Gat pride banner
   - Public product showcase with WhatsApp direct inquiry
   - Upcoming public meetings & notices noticeboard
2. **Secure Role-Based Authentication**
   - JWT tokens with protected routes and role verification (`admin` vs `member` vs `visitor`)
   - 1-Click Academic Demo Login for examiners (`admin@sakhisetu.org` / `admin123`)
3. **Dashboard (Home)**
   - Group overview (*Sakhi Mahila Bachat Gat, Shivaji Nagar, Pune*)
   - 4 Dynamic Stat Cards matching specifications:
     - **Total Members**: 20 (Active members count)
     - **Next Meeting**: 26 Oct 2026 (Countdown & details)
     - **Total Group Savings**: ₹25,000 (Calculated from transactions)
     - **Total Loans**: ₹8,000 (Active outstanding balances)
   - Recent announcements & recent savings transactions ledger
4. **Member Management & Directory**
   - Search by name, member code (`MBG-001`), phone number
   - Filter by status (Active / Inactive)
   - Add Member form with auto-generated code
   - Member financial history modal (Individual savings ledger, attendance percentage, active loans)
   - Soft deactivation/activation with confirmation dialog
5. **Meeting Scheduling & Attendance Sheet**
   - Schedule meeting with date, time, venue, and multi-line agenda
   - Interactive attendance sheet: Toggle `Present` / `Absent` / `Leave`
   - Bulk save attendance with MongoDB compound unique constraint to prevent duplicates
6. **Savings & Contribution Ledger**
   - Positive amount validation
   - Record contribution with payment mode (Cash, UPI, Bank Transfer) and month
   - Member-wise and group-wide automatic balance summation
7. **Loan & Repayment Ledger**
   - Issue loan with principal amount, interest rate (e.g. 1% per month), purpose, and agreed terms
   - Repayment modal with principal and interest breakdown
   - Real-time outstanding balance calculation
   - Repayment history ledger modal
8. **Products & Local Market Showcase**
   - Member-crafted goods: Homemade Mango Pickles, Handloom Cotton Bags, Embroidered Purses, Kolhapuri Spices, Herbal Soaps
   - Interactive modal with 1-click WhatsApp inquiry URL generator (`wa.me/91...`)
   - Admin CRUD management
9. **Announcements Notice Board**
   - Priority badges (Urgent / Normal)
   - Categorized notices (Meeting notice, Scheme, Financial, Exhibition)
10. **Reports & Audit Statements**
    - Month filter (e.g., `2026-10`)
    - Monthly savings collection, new loans disbursed, repayments received, and attendance rate
    - Official printed letterhead with signature blocks for President, Secretary, and Treasurer (`window.print()`)
    - One-click CSV/Excel export

---

## 🔑 Demo Credentials (For Presentation & Evaluation)

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Group Leader (Admin)** | `admin@sakhisetu.org` | `admin123` | Full control (Add members, mark attendance, record savings, issue loans, manage products & notices) |
| **Group Member** | `meera@sakhisetu.org` | `member123` | View group records, personal savings, products showcase, announcements |
| **Public Visitor** | *No login needed* | - | View public home, browse products, send WhatsApp inquiries |

---

## 💻 Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher; tested on v22.19.0)
- [MongoDB](https://www.mongodb.com/) (Local service or MongoDB Atlas connection URI)

### 1. Clone & Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
In `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sakhisetu
JWT_SECRET=sakhi_setu_super_secure_jwt_secret_key_2026
NODE_ENV=development
```

### 3. Seed Realistic Demo Data
Populates the database with 20 members, ₹25,000 savings, ₹8,000 loans, meetings, and products:
```bash
cd backend
npm run seed
```

### 4. Run Application
Run the backend and frontend:
```bash
# Terminal 1: Backend Server
cd backend
npm run dev

# Terminal 2: Frontend Client
cd frontend
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 🏛️ Project Directory Structure
```
Sakhi setu/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Mongoose DB connection
│   │   ├── models/                   # Group, User, Member, Meeting, Attendance,
│   │   │                             # Savings, Loan, Product, Announcement
│   │   ├── controllers/              # Business logic & aggregation pipelines
│   │   ├── middleware/               # JWT authentication & role-based checks
│   │   ├── routes/                   # REST API routes
│   │   ├── seed/
│   │   │   └── seedData.js           # 20-member demo data seeder
│   │   └── server.js                 # Express server
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Sidebar, Topbar, MobileNav, LanguageSelector, ConfirmModal
│   │   ├── context/                  # AuthContext, LanguageContext
│   │   ├── pages/                    # PublicHome, Login, Dashboard, Members, Meetings,
│   │   │                             # Savings, Loans, Products, Announcements, Reports, Settings
│   │   ├── services/                 # API service client & Trilingual dictionary (MR/HI/EN)
│   │   ├── index.css                 # Calm green-and-white theme & responsive styles
│   │   ├── App.jsx                   # Tab routing & layout
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                      # Root scripts
└── README.md
```

---

## 🛡️ Security & Privacy
- Passwords hashed using `bcryptjs` with salt rounds.
- Role verification performed server-side on every write operation.
- MongoDB compound unique indices prevent duplicate member attendance.
- Minimal personal data collected in compliance with SHG guidelines.
