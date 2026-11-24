# CanCare Connect

Final project for **Introduction to Software Engineering** (Section SE-3B), submitted to
Mam Amna Awan

**Made by:**
- Kashaf Fatima (25F-3000)
- Ushna (25M-3036)

## About the project

CanCare Connect is a web app that helps cancer patients and caregivers in Pakistan find
verified hospitals, check what machinery/equipment is available where, get a rough idea of
treatment costs, look up verified doctors, and browse financial aid programs they might be
eligible for. There's also a login system with different roles: patients, doctors, hospital
representatives, and an admin who verifies accounts and manages the data.

It's a frontend-only project for this course, there's no real server or database. All the
data (accounts, hospitals, doctors, cost records, aid programs) is stored in the browser's
localStorage and gets seeded automatically the first time you open the site.

## Live site

https://<your-github-username>.github.io/CanCare-Connect/

## How to run it

Just open `index.html` in a browser (Chrome works best) by double-clicking the file is enough,
no server, installation or build step needed.

## Demo accounts

All seeded automatically the first time the site loads. Password for every account is
`Password123`.

| Email | Role |
|---|---|
| admin@cancare.pk | Administrator |
| ayesha.raza@shaukatkhanum.pk | Doctor (verified) |
| hamza.farooq@example.com | Doctor (pending verification) |
| rep@shaukatkhanum.pk | Hospital Representative (verified) |
| usman@example.com | Hospital Representative (pending verification) |
| ali.hassan@example.com | Patient / Caregiver (suspended account) |

You can also just register a new account from the login page and pick a role.

## Pages in this project

| Page | File |
|---|---|
| Login / Register | `index.html` |
| Home dashboard | `dashboard.html` |
| Hospital search | `search.html` |
| Hospital detail | `hospital-detail.html` |
| Compare hospitals | `compare.html` |
| Doctor directory | `doctors.html` |
| Doctor profile (and credential submission) | `doctor-profile.html` |
| My profile (patients and admin) | `profile.html` |
| Cost estimator | `estimate.html` |
| Financial aid directory | `aid.html` |
| Hospital representative panel (machinery, fees, authorisation) | `rep-panel.html` |
| Admin – verification queue | `admin-verify.html` |
| Admin – manage users and audit log | `admin-users.html` |
| Admin – manage cost & aid data | `admin-data.html` |

## What each role can do

- **Patient/Caregiver** – search hospitals, compare them, get a cost estimate (and download
  it as a PDF), browse financial aid programs, edit their own profile.
- **Doctor** – same browsing features, plus their own profile page where they can submit
  their PMDC number and qualifications for verification.
- **Hospital Representative** – a panel to submit/update their authorisation document, and to
  update their hospital's machinery status and fee schedule.
- **Administrator** – approve/reject pending doctors and reps, suspend/reactivate users, add
  or archive cost records and aid programs, and search/filter the audit log.

## Code structure

- `css/style.css` – all styling for every page
- `js/storage.js` – the only file that reads/writes localStorage (hospitals, users, cost
  records, aid programs, audit log)
- `js/auth.js` – login, register, logout
- `js/estimator.js` – the cost estimation logic
- `js/ui.js` – shared bits used across pages (navbar, toasts, formatting helpers)
- `js/pages/` – one file per page, handling that page's own logic
`storage.js` holds the data
for Hospital, HospitalMachinery, CostRecord, AidProgram, User (and its Doctor, Patient,
HospitalRepresentative and Administrator subtypes), and AuditLog; `auth.js` covers the
User login/logout/profile behaviour; `estimator.js` covers CostEstimator
