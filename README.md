# nyvo clean

Responsive laundry & dry-cleaning UI for **nyvo clean** — works as a mobile web app and desktop website.

Built from Figma screens (ClickLaundry redesign) with dummy data for demo. Ready to deploy to Git + GCP later.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- Lucide icons

## Run locally

```bash
cd nyvo-clean
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Screens & flows

**From Figma**
- Splash / Welcome
- Onboarding (3 slides)
- Sign In (mobile + OTP)
- Verify OTP
- Sign Up + email OTP
- Complete Profile
- Profile success
- Location prompt + map select
- Home (schedule banner, refer & earn, services, ongoing orders)
- Services grid + Book slot

**Added for a complete product flow**
- Service detail with item pricing & add to cart
- Cart / checkout summary
- Multi-step pickup & delivery scheduling
- Orders list + tracking timeline
- Account
- Refer & Earn

## Dummy data

Seeded in `src/data/dummy.ts` and app state in `src/context/AppContext.tsx` (user Arjun Patel, sample cart & orders). No backend yet — OTP accepts any 4+ digit code.

## Deploy notes (later)

- Static hosting works with `npm run build` → `dist/`
- For GCP: Cloud Storage + Load Balancer, or Cloud Run with a static nginx image
- Set SPA fallback so client routes resolve (`/*` → `index.html`)
