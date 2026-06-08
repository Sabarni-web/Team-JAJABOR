# Team Jajabor — Photographer Booking Website

A premium Next.js 16 photographer booking website for Team Jajabor with full Team Management features.

## ✨ New Features Added

### 🌐 Public Team Page (`/team`)
- Displays all team members in a luxurious dark gold card grid
- Each card shows: photo, name, email, phone, specialization badge
- Fully responsive for mobile, tablet, desktop
- Animated social media button (logo expands Instagram, Facebook, WhatsApp, YouTube)

### 🔐 Admin Panel (`/admin`)
- Dashboard with team member stats
- "Add Team Member" button opens a modal form
- Form fields: Photo upload, Full Name, Email, Phone, Specialization (dropdown)
- Delete team members with confirmation
- Protected by `x-admin-key` header (`jajabor-admin-2026` by default)

### 🔢 Database Schema (MySQL)
Table: `team_members`
- `id` BIGINT AUTO_INCREMENT PRIMARY KEY
- `name` VARCHAR(120) NOT NULL
- `email` VARCHAR(255) NOT NULL
- `phone` VARCHAR(50) NULL
- `specialization` VARCHAR(100) NOT NULL
- `photo_url` VARCHAR(500) NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 📡 API Routes
- `GET /api/team` — Public. Fetch all team members
- `POST /api/team` — Admin only. Add team member (multipart/form-data with photo upload)
- `DELETE /api/team/:id` — Admin only. Remove a team member

### 🎨 Animated Social Button
The circular logo button in the navbar (inspired by the design concept):
- **Idle**: Pulses with golden glow animation
- **On Click**: Four social icons (Instagram, Facebook, WhatsApp, YouTube) expand outward in a circular arrangement with spring animation
- **On Click Again**: Icons contract back to center

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Fill in your MYSQL_URL

# Run development server
npm run dev
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MYSQL_URL` | MySQL connection string | — (required) |
| `ADMIN_SECRET_KEY` | Key for admin API routes | `jajabor-admin-2026` |

## 📁 New Files & Changes

```
src/
├── app/
│   ├── page.tsx                    ← UPDATED: Added Team nav link + AnimatedSocialButton
│   ├── globals.css                 ← UPDATED: Added socialPulse/socialGlow keyframes
│   ├── team/
│   │   └── page.tsx               ← NEW: Public team page with animated social button
│   ├── admin/
│   │   └── page.tsx               ← NEW: Admin dashboard with Add/Delete team members
│   └── api/
│       └── team/
│           ├── route.ts            ← NEW: GET + POST /api/team
│           └── [id]/
│               └── route.ts       ← NEW: DELETE /api/team/:id
└── lib/
    └── mysql.ts                    ← UPDATED: Added team_members table + CRUD helpers
public/
└── uploads/                        ← NEW: Uploaded team member photos stored here
next.config.ts                      ← UPDATED: Added body size limit for image uploads
.env.example                        ← NEW: Environment variable template
```

## 🔒 Admin Access

Navigate to `/admin` to access the admin panel.
The default admin key is `jajabor-admin-2026`. Change `ADMIN_SECRET_KEY` in `.env.local` for production.

> **Production Note**: Add proper authentication (NextAuth, JWT, session cookies) before deploying the admin panel publicly.
