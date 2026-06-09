# Design Specification: Aura MSME Business Financial Tracker

**Date:** 2026-06-09  
**Status:** Approved  
**Design System:** Aura Light  
**Target Architecture:** Next.js (App Router) + Express 5 + Supabase Postgres & Auth  

---

## 1. Goal & Product Vision

This application is an **MSME (UMKM) Business Financial Tracker & Health Analyzer**. It helps Indonesian small business owners track key financial variables (initial capital, fixed monthly costs, variable monthly costs, and monthly revenue) to analyze their business's runway, burn rate, and health category.

The app uses **Aura Light** design tokens to present a clean, high-contrast, professional, and accessible dashboard that avoids "AI slop" aesthetics. It features secure accounts and data persistence using **Supabase Auth & PostgreSQL** via JSON Web Tokens (JWTs).

---

## 2. Architecture & Components

The application is structured as a unified monorepo running Next.js as the page-routing frontend and Express 5 as the REST API backend.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js Frontend                     │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ Landing Page │  │ Auth Pages  │  │ Dashboard /   │  │
│  │     (/)      │  │(login/reg)  │  │ Tracker Pages │  │
│  └──────────────┘  └─────────────┘  └───────────────┘  │
│          ▲                ▲                 ▲          │
│          └────────────────┼─────────────────┘          │
│                    Axios API Client                    │
│             (Bearer JWT Authorization Header)          │
└───────────────────────────┬────────────────────────────┘
                            │ (JSON Web Token)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express 5 Backend                    │
│   ┌────────────────────────────────────────────────┐   │
│   │               requireAuth Middleware           │   │
│   │           (validates JWT via Supabase Auth)    │   │
│   └───────────────────────┬────────────────────────┘   │
│                           ▼                            │
│           ┌────────────────────────────────┐           │
│           │      Protected API Routes      │           │
│           │  (REST endpoints: /simulations)│           │
│           └────────────────────────┬───────┘           │
└────────────────────────────────────┼───────────────────┘
                                     ▼
                      ┌─────────────────────────────┐
                      │    Supabase PostgreSQL      │
                      │  (RLS enforced by User ID)  │
                      └─────────────────────────────┘
```

### Component Details
1. **Frontend Components**:
   - `AuthProvider`: Context provider wrapping the application to supply user login status, active JWT tokens, and login/register utility functions.
   - `Navigation`: Responsive site header showing navigation links and auth state (Login/Register or Dashboard/Logout).
   - `SimForm` / `FinancialInputForm`: Clean input form built with Aura Light spacing, borders, and typography.
   - `ResultCard`: Visualized report displaying business health category, monthly burn rate, remaining runway, and a confidence note.
   - `HistoryTable`: Structured paginated lists of past analyses with the option to delete simulations.

2. **Backend Services (`server.js`)**:
   - `requireAuth`: Middleware that extracts the authorization header, verifies the JWT token with Supabase Auth, and populates `req.user`.
   - `/api/predict`: Unprotected/public endpoint for immediate trial prediction (simulated AI).
   - `/api/simulations` (POST/GET/DELETE): Protected database storage endpoints, filtering results based on the verified `user_id`.

---

## 3. Database Schema Updates

We will execute a Supabase migration to adapt the `simulations` table for user multi-tenancy:

```sql
-- Link simulations to Supabase auth.users
ALTER TABLE simulations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS)
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to perform operations on their own data
CREATE POLICY "Users can only access their own simulations"
  ON simulations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index user_id for faster lookups
CREATE INDEX IF NOT EXISTS simulations_user_id_idx ON simulations (user_id);
```

---

## 4. Visual Design: Aura Light Implementation

We adhere strictly to the **Aura Light** design tokens defined in `aura-DESIGN.md`:

### Color Tokens
* `background`: `#ffffff` (Page and card background)
* `secondary-surface`: `#f5f5f5` (Inputs, hover states, tables)
* `surface-muted`: `#fafafa` (Side panels, secondary layout sections)
* `foreground`: `#171717` (Primary text, headings)
* `medium-gray`: `#525252` (Body copy, labels)
* `muted-text`: `#737373` (Captions, helper texts, secondary icons)
* `primary-action`: `#171717` (Primary button fill, strong CTA background)
* `primary-foreground`: `#fafafa` (Text on buttons)
* `border`: `#e6e6e6` (Card outlines, line separators)

### Typography
* Global font: `Inter, sans-serif`
* Display/Hero title: `60px`, weight `500`, line-height `60px`, letter-spacing `-3px`.
* Section title: `18px`, weight `500`, line-height `28px`, letter-spacing `-0.45px`.
* Body typography: `16px` (default) and `14px` (small).

### Depth & Corners
* **Flat styling**: No box-shadows. Elevation is represented by solid borders (`1px solid var(--border)`).
* **Focus states**: Inputs and active buttons receive a solid outline (`2px solid var(--foreground)`) on focus or hover.
* **Border Radii**:
  - Cards: `radius-lg` (16px)
  - Inputs, Buttons: `radius-md` (8px)
  - Small elements / Tags: `radius-sm` (6px)

---

## 5. Error Handling & Stability

* **No Credentials Fallback**: If Supabase credentials are not provided (no `.env`), the app will fall back to **Local Storage Mode** for authentication and data storage rather than throwing unhandled errors or crashing.
* **Network Failures**: Axios interceptors will handle `401 Unauthorized` responses by automatically clearing local auth tokens and redirecting users to `/login`.
* **Form Validation**: Clean error highlights under input fields, following the Aura design system's border/outline specifications.
