# 🌿 PlantMD: AI-Powered Agricultural Diagnostic SaaS

PlantMD is a premium, high-fidelity digital ecosystem designed to bridge the "Diagnostic Gap" for farmers. Using **Google Gemini 2.0 Generative AI (Vision)**, PlantMD provides instant, expert-level plant pathology analysis while facilitating a professional human-in-the-loop workflow for expert agronomists.
---
Demo Video: https://www.loom.com/share/d93efee783154df39d5f7ccf87826d1f
---

## ✨ Key Features

- **🧠 Multimodal AI Diagnosis:** Real-time analysis of crop diseases using **Gemini 2.5 Flash** (vision + structured JSON) with detailed treatment plans and confidence scoring.
- **👥 Role-Aware Dashboards:** Dedicated interfaces for **Farmers** (Upload/History), **Agronomists** (Expert Review Queue), and **Admins** (Global Analytics).
- **📱 Real-time SMS Alerts:** Automated notifications sent directly to farmers' mobile phones via an integrated SMS gateway.
- **🔍 Global Case Management:** Advanced search and filtering system for tracking agricultural cases across the platform.
- **🛡️ Secure Cloud Infrastructure:** Built on Supabase with Row Level Security (RLS) to ensure data privacy and integrity.
- **🎨 Premium UX/UI:** A high-end, responsive "Forest Green" dashboard inspired by modern design standards.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router & Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Intelligence:** [Google Generative AI SDK](https://ai.google.dev/) (Gemini API)
- **Backend/DB:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Icons:** [Lucide React](https://lucide-react.io/)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd plant-disease
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_gemini_api_key

# Optional: SMS (InfiniReach)
INFINIREACH_API_KEY=
INFINIREACH_DEVICE_ID=
INFINIREACH_SENDER_NUMBER=

# Optional: local seed script only (bypasses RLS) — never expose in the browser
SUPABASE_SERVICE_ROLE_KEY=
```

### Database migrations

For an **existing** Supabase project, run `supabase/migrations/20260329120000_rls_and_schema_alignment.sql` in the SQL Editor to add missing columns (`treatment_plan`, `phone_number`, `sms_notifications_enabled`) and tighten row level security. New projects can apply `supabase/schema.sql` as a baseline (adjust the auth trigger syntax if your Postgres version requires it).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Farmer** | `john@southfarm.com` | `password123` |
| **Agronomist** | `alice@agri.gov` | `password123` |
| **Admin** | `b.kwizera@alustudent.com` | `ihaveapassword` |

---

## 📁 Project Structure

- `app/(dashboard)/`: Unified dashboard views for all roles.
- `app/actions/`: Server actions for AI logic and DB updates.
- `components/`: UI primitives and layout shells.
- `lib/`: Shared utility functions (Supabase client, SMS helpers).
- `supabase/`: Database schema and seed scripts.

---

## 📄 License
This project is developed as part of a Team Assignment for Plant Disease Early Warning Systems. All rights reserved.

