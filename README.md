# College of Physiotherapy — Full-Stack Website & CMS (React + PHP + MySQL)

Full-stack website and management portal for **Dr. Vithalrao Vikhe Patil Foundation's College of Physiotherapy, Viladghat, Ahilyanagar (MS) — 414111**.

Designed for production deployment on **Hostinger Shared Hosting** (Apache + PHP 8+ + MySQL) without requiring a Node.js server.

---

## 🏛️ Project Architecture

```
physio-college-site/
├── database/
│   ├── schema.sql              # Complete MySQL relational schema (UTF8mb4)
│   └── seed.sql                # Initial data, courses, faculty, and admin account
│
├── frontend/                   # React SPA (Vite + React Router + Axios)
│   ├── src/
│   │   ├── components/         # Preserved Header, Logos, Dual-Row Navigation, Footers
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx # Institutional public frame
│   │   │   └── AdminLayout.jsx  # Academic administrative dashboard with sidebar
│   │   ├── pages/              # Public Pages (Home, About, Faculty, Gallery, etc.)
│   │   │   └── admin/          # Admin CRUD (Dashboard, Notices, Events, Faculty, etc.)
│   │   ├── services/
│   │   │   ├── api.js          # Central Axios client with Bearer auth interceptors
│   │   │   └── endpoints.js    # Typed API service wrappers with fallback resilience
│   │   ├── hooks/
│   │   │   └── useAuth.jsx     # Authentication context & protected route guard
│   │   ├── data/
│   │   │   └── collegeData.js  # Institutional baseline fallback content
│   │   └── styles.css          # Institutional blue / navy / white design system
│   ├── public/
│   │   └── .htaccess           # Production Apache routing & compression rules
│   └── vite.config.js          # Development API proxy configuration
│
├── backend/                    # PHP 8+ REST API Backend
│   ├── config/
│   │   ├── database.php        # PDO connection (host, user, pass, utf8mb4)
│   │   └── config.php          # CORS headers, upload constants, and secret key
│   ├── helpers/
│   │   ├── Auth.php            # HMAC-SHA256 Bearer tokens & bcrypt hashing
│   │   ├── Response.php        # JSON standardizer: { success, data, message }
│   │   └── Uploader.php        # File & poster validation (MIME, 10MB limit)
│   ├── middleware/
│   │   └── AuthMiddleware.php  # Protected admin route gatekeeper
│   ├── api/
│   │   └── index.php           # Central REST Router for all domains
│   ├── uploads/                # Safe storage for PDFs, posters, and faculty photos
│   └── .htaccess               # Apache REST rewrite rules
│
├── HOSTINGER_DEPLOYMENT.md     # Production deployment walkthrough
└── README.md
```

---

## 🎨 Visual Identity & Navigation Preservation

- **Institutional Palette**: Primary Blue (`#1a4f8b`), Dark Navy (`#071d3a`), Crimson Red (`#a11212`), Gold accent (`#c9a227`).
- **Typography**: Google Fonts `Merriweather` (Headings) and `Roboto` (Body).
- **Navigation Row 1** (without dropdowns):
  `HOME` · `ABOUT` · `FACULTY` · `GALLERY` · `NOTICES` · `CONTACT`
- **Navigation Row 2** (with dropdowns):
  `ACADEMICS` · `ADMISSIONS` · `DEPARTMENTS` · `STUDENT CORNER` · `RESEARCH` · `FACILITIES` · `TRAINING & PLACEMENT` · `R&D` · `IQAC / NAAC` · `HOSPITAL` · `MANDATORY DISCLOSURES`

---

## 🚀 Running Locally

### 1. Database Setup
Import `database/schema.sql` and `database/seed.sql` into your local MySQL server (e.g. XAMPP/MariaDB):
```bash
mysql -u root < database/schema.sql
mysql -u root physio_college < database/seed.sql
```

### 2. Start PHP Backend API
```bash
cd backend
php -S localhost:8000 -t .
```
Verify the API: [http://localhost:8000/api/info](http://localhost:8000/api/info)

### 3. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Administrative Control Panel

- **Admin URL**: `/admin` (or `/admin/login`)
- **Default Email**: `admin@vikhepatil.org`
- **Default Password**: `Admin@2026#`

### Admin Management Capabilities:
- **Dashboard**: Metric cards (Notices, Events, Faculty, Courses, Gallery, Unread Enquiries).
- **Notices**: Publish circulars, set expiry dates, attach PDF downloads.
- **Events**: Schedule academic conferences, seminars, guest lectures, and upload banners.
- **Faculty**: Directory of professors, specializations, qualifications, and photos.
- **Courses**: Manage BPT, MPT, Ph.D. degrees, approved intake, eligibility, and fee structure.
- **Departments**: Clinical and academic departments and assigned HODs.
- **Gallery**: Category filtering and high-resolution photo uploads.
- **Facilities**: Laboratories, library, clinical postings, hostels, sports, and hospital.
- **Admissions**: Dynamic admission procedures, dates, and eligibility criteria.
- **Pages (CMS)**: In-browser rich content editor for About, Research, IQAC, Hospital, etc.
- **Contact Messages**: Live inbox to review and follow-up on public enquiries.
- **Users**: Admin account management and role-based permissions.
- **Settings**: College contact information and header affiliation/accreditation lines.

---

## 📦 Hostinger Shared Hosting Deployment

See the detailed instructions in [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md).

Quick summary:
1. Create a MySQL Database in Hostinger hPanel and import `schema.sql` + `seed.sql`.
2. Configure credentials in `backend/config/database.php`.
3. Run `npm run build` in `/frontend`.
4. Upload `dist/` files to `public_html/`.
5. Upload `backend/` to `public_html/backend/`.
