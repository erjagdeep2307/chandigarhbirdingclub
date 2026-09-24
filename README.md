# 🦅 Chandigarh Birding Club — Next.js & Neon PostgreSQL

A full-fledged Next.js (App Router) application with Tailwind CSS, light & dark theme toggle, an admin API suite, and Neon PostgreSQL database integration — preserving the exact original layout, typography, colors, and content of the Chandigarh Birding Club.

---

## ✨ Features

- **Exact Design & Layout Fidelity**:
  - Typography: **Playfair Display** (titles and serif accents) & **Inter** (body).
  - Authentic color palette:
    - Saffron (`#FF6B00`, `#FFF0E0`, `#FFB347`)
    - Jade (`#1B7A4A`, `#E0F5EB`)
    - Peacock Blue (`#0057A8`, `#E0EEFF`)
    - Rose (`#D63B6A`, `#FDEAF0`)
    - Hornbill Yellow (`#FFD700`) & Deep Dark Hornbill (`#1A1A1A`)
    - Cream Canvas (`#FFFBF2`) in light mode & Deep Forest Night (`#0C120F`) in dark mode.
  - Authentic Indian Grey Hornbill vector logo in `public/images/logo.svg`.
  - 4 Interactive Tabs:
    - 🌿 **Nature Walks**: Upcoming expeditions with registration, past walks records with species counts and emojis.
    - 📸 **Bird Gallery**: Sightings grid with week labels, photo/emoji displays, spotter attribution.
    - 👥 **Club Members**: Member cards with colored gradient initials avatars (`av-1` to `av-8`), roles, joined years, specialties.
    - 🦅 **About**: Mission banner, 6 feature cards, contact channels, and founder card for Vartika Arora.

- **🌗 Light & Dark Theme Switcher**:
  - Tactile Sun/Moon toggle in the header.
  - Compliant with modern web standards:
    - Sets `<meta name="color-scheme">` for browser UI adaptation (scrollbars, form elements).
    - Automatically detects system preference (`prefers-color-scheme: dark`) with real-time listener.
    - Persists user choice in `localStorage`.
    - Zero Flash of Unstyled Content (FOUC).

- **🗄️ Neon PostgreSQL Integration & Fallback Mode**:
  - Direct HTTP-pooled connection using `@neondatabase/serverless` (zero cold-start latency).
  - Tables automatically verified and created on startup:
    - `walks`
    - `past_walks`
    - `birds`
    - `members`
  - **Graceful Fallback**: If `DATABASE_URL` is not yet set, the app seamlessly runs using an in-memory/starter dataset without crashing.
  - Setup script: `npm run db:setup` runs database table verification.

- **🔐 Admin Authentication & API Layer**:
  - Secure password authentication using administrator records stored in the database.
  - Protected API endpoints returning HTTP 401 for unauthorized mutations:
    - `POST /api/walks` — Post new walk announcement.
    - `PATCH /api/walks/[id]` — Mark walk as done / move to past walks.
    - `DELETE /api/walks/[id]` — Remove walk.
    - `POST /api/walks/past` — Add past walk record.
    - `DELETE /api/walks/past/[id]` — Remove past walk record.
    - `POST /api/birds` — Upload bird sighting.
    - `DELETE /api/birds/[id]` — Remove bird sighting.
    - `POST /api/members` — Add club member.
    - `DELETE /api/members/[id]` — Remove member.
    - `POST /api/auth/login` — Session creation with HTTP-only cookie.
    - `POST /api/auth/logout` — Invalidate session.
    - `GET /api/auth/check` — Check session validity.
  - Accessible password modal with shake animation on invalid credentials and light-dismiss on backdrop click.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or edit `.env.local`:
```env
# Neon PostgreSQL Connection String
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require

# Private setup key for generating a password hash through the setup API
PASSWORD_HASH_API_KEY=generate-a-long-random-setup-key

# JWT Secret for Session Verification
JWT_SECRET=your-secure-secret-key-here
```

### 3. Initialize Neon Database (Optional)
Once you paste your Neon `DATABASE_URL`, initialize the tables with:
```bash
npm run db:setup
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
chdbirdclub/
├── legacy_backup/               # Safe backup of original static files
│   ├── index.html
│   ├── style.css
│   └── logo.css
├── public/
│   └── images/
│       └── logo.svg             # Indian Grey Hornbill club vector logo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/            # /login, /logout, /check
│   │   │   ├── walks/           # GET, POST, PATCH, DELETE
│   │   │   │   └── past/        # Past walks CRUD
│   │   │   ├── birds/           # Bird sightings CRUD
│   │   │   └── members/         # Member roster CRUD
│   │   ├── globals.css          # Theme variables & animations
│   │   ├── layout.tsx           # Playfair Display & Inter fonts, theme provider
│   │   └── page.tsx             # Main application page
│   ├── components/
│   │   ├── Header.tsx           # Header, logo, navigation, theme toggle
│   │   ├── AdminBar.tsx         # Guest/admin indicator & trigger
│   │   ├── HornbillBanner.tsx   # Chandigarh state bird highlight
│   │   ├── PasswordModal.tsx    # Accessible modal with light-dismiss
│   │   ├── ThemeContext.tsx     # Light/Dark mode state management
│   │   ├── ThemeToggle.tsx      # Sun/Moon toggle button
│   │   └── tabs/
│   │       ├── NatureWalksTab.tsx
│   │       ├── BirdGalleryTab.tsx
│   │       ├── MembersTab.tsx
│   │       └── AboutTab.tsx
│   └── lib/
│       ├── auth.ts              # JWT & password verification
│       ├── db.ts                # Neon Postgres driver & fallback store
│       ├── schema.sql           # Database DDL schema
│       └── types.ts             # TypeScript definitions
├── scripts/
│   ├── init-db.mjs              # Standalone Neon table initializer
│   └── test-api.mjs             # 11-step API verification test suite
├── .env.example
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
