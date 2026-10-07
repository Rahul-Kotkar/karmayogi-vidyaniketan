# Hostinger Shared Hosting Deployment Guide

## College of Physiotherapy Full-Stack Management System
**Dr. Vithalrao Vikhe Patil Foundation's College of Physiotherapy**

This website runs as a **Static React SPA** served by Apache alongside a **PHP 8+ REST API** and **MySQL database**. It is 100% compatible with Hostinger Shared Web Hosting (Single, Premium, Business, or Cloud plans).

> [!NOTE]
> **No Node.js runtime is required on Hostinger.**
> React is pre-compiled into static HTML, CSS, and JS bundles that Apache serves directly. All dynamic data (Notices, Events, Faculty, Admissions, Courses, Gallery, CMS Pages, and Messages) is handled by PHP 8+ and MySQL.

---

## 1. Directory Structure on Hostinger (`public_html/`)

Upload your files to Hostinger's File Manager so the root `public_html/` looks like this:

```
public_html/
├── .htaccess                   # Apache rewrite rules for React SPA and /api routes
├── index.html                  # React entry point (from frontend/dist/index.html)
├── assets/                     # Built JS/CSS bundles (from frontend/dist/assets/)
│   ├── index-[hash].js
│   └── index-[hash].css
├── backend/                    # PHP REST Backend
│   ├── config/
│   │   ├── database.php        # MySQL credentials configuration
│   │   └── config.php          # App configuration & CORS
│   ├── helpers/
│   │   ├── Auth.php            # HMAC-SHA256 tokens & password verification
│   │   ├── Response.php        # JSON response standardizer
│   │   └── Uploader.php        # Safe image/PDF uploader
│   ├── middleware/
│   │   └── AuthMiddleware.php  # Protected admin route guard
│   ├── api/
│   │   ├── index.php           # Central REST API router
│   │   └── .htaccess           # API rewrite rules
│   └── uploads/                # Dynamic uploaded media (notices, events, faculty)
│       ├── notices/
│       ├── events/
│       ├── faculty/
│       └── gallery/
└── database/
    ├── schema.sql              # Relational schema
    └── seed.sql                # Initial data & admin account
```

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Create MySQL Database on Hostinger
1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** → **Management**.
3. Under **Create a New MySQL Database and User**, enter:
   - **Database Name**: e.g., `u123456789_physio`
   - **Database Username**: e.g., `u123456789_admin`
   - **Password**: Enter a strong password (save this securely)
4. Click **Create**.

### Step 2: Import Database Tables & Seeds
1. In Hostinger hPanel under **Databases**, click **Enter phpMyAdmin** next to your newly created database.
2. Click on the **Import** tab at the top.
3. Click **Choose File** and select `database/schema.sql` from this project. Click **Go** at the bottom.
4. Once completed, click **Import** again, select `database/seed.sql`, and click **Go**.
5. All 13 relational tables and initial data (including notices, faculty, courses, and default admin) are now ready.

### Step 3: Configure Database Credentials in PHP
1. In your project, open `backend/config/database.php`.
2. Update the fallback database credentials or configure environment variables in Hostinger:
   ```php
   $host     = 'localhost'; // Usually 'localhost' on Hostinger
   $dbName   = 'u123456789_physio'; // Your Hostinger database name
   $user     = 'u123456789_admin';  // Your Hostinger database username
   $password = 'Your_Hostinger_DB_Password_Here';
   $port     = '3306';
   ```
3. Save the file.

### Step 4: Build the React Frontend
On your development computer:
1. Open terminal and enter the `frontend` folder:
   ```bash
   cd frontend
   npm run build
   ```
2. This generates the production bundle inside `frontend/dist/`.
   The `dist/` directory already includes:
   - `index.html`
   - `assets/` (compressed CSS and JS)
   - `.htaccess` (pre-configured Apache routing)

### Step 5: Upload Files to Hostinger File Manager
1. Open **Hostinger hPanel** → **File Manager** (or connect via FTP / FileZilla).
2. Enter the `public_html/` directory.
3. Upload all files from `frontend/dist/` directly into `public_html/`.
4. Upload the entire `backend/` folder into `public_html/backend/`.
5. Ensure `public_html/backend/uploads/` exists and has write permissions:
   - Right click `backend/uploads/` → **Permissions** → set to `755` (or `775`).

---

## 3. Administrator Access

Once deployed, visit your domain:

- **Public Website**: `https://yourdomain.com/`
- **Admin Portal**: `https://yourdomain.com/admin/login`

### Default Admin Credentials
| Field | Value |
|---|---|
| **Email** | `admin@vikhepatil.org` |
| **Password** | `Admin@2026#` |

> [!TIP]
> After logging in for the first time, you can go to **Users** in the sidebar to update your email or change your password.

---

## 4. Admin Management Modules

1. **Dashboard**: Live summary counters (Total Notices, Upcoming Events, Faculty, Courses, Gallery Images, Unread Enquiries).
2. **Notices**: Publish official college circulars with PDF document attachments.
3. **Events**: Add academic conferences, workshops, venues, and posters.
4. **Faculty**: Add/edit professors, qualifications, clinical specializations, and photographs.
5. **Courses**: Manage BPT, MPT, Ph.D. program details, eligibility criteria, and seat intakes.
6. **Departments**: Manage specialized physiotherapy departments and HODs.
7. **Gallery**: Upload photos into categories (Campus, Clinical Training, Events, etc.).
8. **Facilities**: Manage infrastructure cards (Labs, Central Library, Classrooms, Hospital).
9. **Admissions**: Edit admission process steps, eligibility, and important dates without editing code.
10. **Pages (CMS)**: Edit rich content for About Us, Principal's Message, Research, IQAC/NAAC, Hospital, and Disclosures.
11. **Messages**: Read and respond to inquiries submitted through the public Contact form.
12. **Users**: Add administrator and editor accounts.
13. **Settings**: Edit phone numbers, email, physical address, and affiliation/accreditation lines in the college header.

---

## 5. Verification Checklist

- [x] Public Homepage renders college header, dual logos, and dual-row navigation.
- [x] Row 1 links (Home, About, Faculty, Gallery, Notices, Contact) work without dropdowns.
- [x] Row 2 links (Academics, Admissions, Departments, etc.) have functioning hover dropdowns.
- [x] Notices page loads circulars and allows PDF downloads.
- [x] Contact form submits enquiries into the database.
- [x] `/admin/login` authenticates administrator using bcrypt hash verification.
- [x] Admin dashboard shows real-time counts and allows CRUD operations on notices, events, faculty, courses, gallery, and settings.
