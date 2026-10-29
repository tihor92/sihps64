# AICTE Integrated Institution Complaint Monitoring Dashboard (ICMS)

A single-window, cross-bureau web platform built for authorized **All India Council for Technical Education (AICTE)** officials across the **Regulation Bureau (RB)**, **Public Grievance Redressal Cell (PGRC)**, **Approval Bureau**, **RIFD**, Regional Offices, and Senior Management.

Designed according to council specifications in `frontend.md` and `backend.md`.

---

## 🌟 Core Features & Innovations

1. **AI Overlap Detection Engine**:
   - Detects concurrent complaints filed across multiple bureaus (e.g., RB and PGRC) against the same institution.
   - Computes weighted correlation confidence (0–100%) incorporating exact Permanent ID matches, active multi-bureau handling, and TF-IDF subject similarity.
   - Provides side-by-side case inspection and collaborative cross-cell directives.

2. **Strict Inter-Bureau RBAC**:
   - Council officers can read complaints across all bureaus to break institutional silos, but can only mutate and take action on cases under their cell's active jurisdiction.
   - Quick **Active Persona Switcher** in the header allows testing any role:
     - `RB Officer` (Dr. Ramesh Sharma)
     - `PGRC Officer` (Dr. Ananya Roy)
     - `Regional Officer` (Er. Suresh Patel - Western Region)
     - `Senior Management` (Prof. K. V. Venkat - Advisor-I)
     - `Admin System`

3. **Executive Dashboard**:
   - 7 Real-time KPI Counters (Total Received, Pending, Under Process, Disposed, Transferred, Escalated, Overdue SLA).
   - Interactive Recharts: Bureau workload distribution, resolution donut breakdown, 5-month registration vs disposal trend, and ageing buckets.
   - Priority widgets with quick-navigation filters.

4. **Procedural Workflow & Append-Only Audit Chain**:
   - Case dossier includes chronological actions, show-cause notices, and hearing decisions.
   - Supports Status Updates, Inter-Bureau Transfers, and Senior Management Escalation with mandatory justification.
   - Full append-only audit trail with officer attribution and timestamps.

5. **Institution Dossier**:
   - Searchable directory of institutions by AICTE Permanent ID, region, and state.
   - Displays prominent warning banner: `Potential Overlapping Cases – Coordination Required` whenever $\ge 2$ bureaus are actively investigating.

6. **Executive Reports & Data Export**:
   - Instant CSV export for Case lists and analytical reports.
   - Print-friendly layouts for council meetings.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deploying to Vercel

This repository includes a production-ready `vercel.json` with SPA routing rewrites configured.

To deploy:
1. Push this repository to GitHub/GitLab.
2. Import the project into your Vercel Dashboard.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**!

