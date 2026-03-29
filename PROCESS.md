# PlantMD: High-Fidelity Disease Diagnostic Dashboard

PlantMD is a premium, AI-powered plant disease diagnostic dashboard designed for farmers, agronomists, and organization admins. It features a modern, interactive UI/UX inspired by high-end dashboards like Donezo, with a deep green aesthetic tailored to the agricultural sector.

## Tech Stack
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide-react.io/)
- **Components**: Radix UI Primitives, Custom Tailwind Components.
- **State Management**: React Hooks & Context API (Role-aware navigation).

## Project Architecture
- `app/(dashboard)/`: Contains all main functional pages.
    - `dashboard/`: Overview of field activity and assigned experts.
    - `diagnose/`: Image upload and AI/Expert selection flow.
    - `cases/`: Comprehensive submission history with filtering and search.
    - `experts/`: Management queue for agronomists to review cases.
    - `analytics/`: Global platform stats for admins.
    - `settings/`: Profile and notification preferences.
- `components/`:
    - `layout/`: Persistent shell (Sidebar with Role Switcher, Topbar with Global Search).
    - `ui/`: Reusable primitive components and the `ImageModal` lightbox.
- `lib/`: Utility functions like the shadcn-style `cn` helper.

##  Progress Summary

### Phase 1: Foundation & Scaffolding
- Established the core Shell with a fixed vertical sidebar.
- Implemented **Role-Aware Navigation** (Farmer, Agronomist, Admin).
- Built a **Dev Role Switcher** for rapid testing during development.
- Scaffolded all 6 major views with high-fidelity mock data.

### Phase 2: UX Polish & Interactivity
- **Global Search**: Search bar in the Topbar syncs directly with the `/cases` history view.
- **Image Lightbox**: Added `ImageModal` for viewing high-res plant macros across the app.
- **Wired Buttons**: All Export/Download/Invite buttons now trigger realistic feedback (toasts/alerts).
- **Advanced Diagnose Flow**: Added image previews, loading states, and AI vs Expert mode switching.
- **Expert Review Queue**: Added sorting (by urgency/time) and case dismissal functionality.

## Design System
- **Primary Color**: `#1A5336` (Deep Forest Green)
- **Aesthetic**: Premium, glassmorphic elements, large rounded corners (`rounded-[32px]`), and subtle micro-animations.
- **Typography**: High-contrast font weights and tracking for a "magazine" feel.

## Instructions for Future Models
When continuing development on PlantMD, please adhere to these guidelines:

1.  **Maintain High Fidelity**: Do not simplify the UI. Use large border radii, subtle shadows, and maintain the current color palette.
2.  **Role Awareness**: Respect the `useRole` hook. New features should be conditionally rendered based on the user's role.
3.  **Interactivity First**: Ensure all new buttons or forms have clear loading states or feedback.
4.  **Component Reuse**: Use the established `Card` pattern and `ImageModal` for consistent layouts.
5.  **Search Conventions**: Use the same pattern found in `topbar.tsx` for global search and `cases/page.tsx` for local filtering.

---
