# Health Canopy — Demo Guide (Contra Costa Health)

**AI-powered supply chain and vaccine management for county health systems — one platform across the hospital, the health centers, and the VFC program.**

## What This App Does

Health Canopy replaces the disconnected point solutions a county health system juggles today — separate tools for supply chain, cold chain monitoring, VFC compliance paperwork, and diversion surveillance — with one platform. It combines real-time inventory across every PAR location, continuous vaccine cold chain telemetry, CDPH VFC program compliance, AI demand forecasting tied to county surveillance data, and Joint Commission readiness.

The demo is configured for **Contra Costa Health** (Contra Costa Health Services): Contra Costa Regional Medical Center (CCRMC) in Martinez plus the Martinez Health Center and Martinez Wellness Center — with the remaining seven county health centers (Antioch, Pittsburg, Concord, San Pablo, Brentwood, North Richmond, Bay Point) shown as onboarding. ~18,470 SKUs, 34 PAR locations, 7 monitored vaccine storage units. EHR is **ccLink (Epic)**; immunization registry is **CAIR2**; VFC accountability runs through **MyCAVax**.

**The demo clock is Monday, March 16, 2026.** All data is anchored to that date.

---

## The Demo Superpowers

### 1. Live Demo Director (`Shift+D` or the clapperboard button, bottom-left)

A presenter-only control that triggers a **scripted cold chain excursion** live:

1. **Trigger fridge excursion** — the Martinez Wellness VFC fridge starts climbing past its 46°F high alarm
2. Within seconds: warning toast fires → Cold Chain sidebar badge goes red → the fridge chart shows the spike → a high-severity AI insight appears on the Dashboard → the activity feed logs the alarm
3. On the Cold Chain page (or the Demo Director), click **"Move doses to backup unit"** — temps recover, the insight downgrades to "Contained," and the activity feed logs the completed transfer with MyCAVax excursion reporting

Use **Reset simulation** between rehearsals.

### 2. Live AI Assistant (sparkle button, bottom-right)

With `ANTHROPIC_API_KEY` set in `.env.local`, the assistant is **real Claude with tool use** over the app's actual dataset — it queries inventory, cold chain telemetry (including the live excursion state), VFC program records, POs, compliance, and financials, then streams a grounded answer. Ask it anything, on or off script.

Without a key it falls back to the scripted response engine (aligned to the same numbers).

### 3. Continuous Cold Chain Telemetry (`/cold-chain`)

Every storage unit ticks live — one reading per 10 sim-minutes. 48-hour strip charts with the 36–46°F safe band, alarm lines, 24h min/max/avg, data logger serials, and calibration countdowns.

---

## Pages & What to Show

### Dashboard (`/`)
KPI row (SKUs, PAR locations, alerts — derived live from the attention list, monthly spend) · supply chain status with the critical Surgical/OR chain highlighted · items needing attention (including short-dated VFC lots with FIFO/transfer actions) · cross-site imbalances with suggested transfers (MMR: Martinez Wellness → Martinez Health Center) · AI insights · deliveries incl. the critical Fresenius Kabi IV fluid delay · live activity feed with VFC dose scans.

### Inventory (`/inventory`)
18,470 SKUs, searchable/filterable, expandable rows with PAR location distribution (Pyxis, vault, fridge), GPO contract references, CSV export. Try "heparin" or "fentanyl."

### Vaccine Mgmt (`/vaccine-management`)
The CDPH VFC plan as a living page: contacts, equipment + data logger documentation with calibration countdowns, staff roles & training, task schedule (twice-daily temp logs → annual recert), **Point-of-Care Scan Inspector** (one barcode scan fanning out to ccLink → CAIR2 → inventory decrement → MyCAVax → audit trail), and SEW reporting.

### Cold Chain (`/cold-chain`)
Live telemetry (above). Select the Martinez Wellness VFC fridge — it trends warm (~43°F) even before the scripted excursion.

### AI Insights (`/ai-insights`)
Current-state analysis: consumption vs. prediction with confidence bands, department breakdown, attention items, anomaly alerts (fentanyl/diversion, respiratory surge).

### Forecasting (`/forecasting`)
14-day demand forecast; what-if scenarios: Normal / **Respiratory Surge** (county surveillance-driven, with specific pre-orders) / **Supply Disruption** (Medline + Cardinal delay with backup vendors and cross-site transfers).

### Financials (`/budget`) · Supply Chain (`/analytics`) · Compliance (`/compliance`)
Budget vs. actual with AI forecast, working PO approval flow, delivery tracking · vendor scorecards, waste analysis, turnover benchmarks · TJC readiness (88) across 7 chapters with findings and audit report generation.

### Roles
Sign in → choose a persona: **Supply Chain Manager** (everything), **Nurse/Unit Coordinator** (My Unit + inventory + vaccines + cold chain, single-unit scope), **Executive** (read-only overview with site rollout status).

---

## Design System

| Color | Meaning |
|-------|---------|
| Terracotta (primary) | Brand, actions, AI recommendations, VFC badges |
| Sage green (accent) | In-range, success, positive |
| Red | Critical, excursion, high-severity |
| Amber | Warning, low stock, due-soon |
| Stone | Neutral, read-only, onboarding |

---

## Key Talking Points

1. **One platform instead of four point solutions** — supply chain (Tecsys-class), cold chain monitoring (SmartSense-class), VFC compliance (AccuVax-class), and diversion surveillance (Bluesight-class) in a single pane, priced for a county system.
2. **VFC is a first-class citizen** — no hospital supply chain vendor models VFC/private stock separation, CAIR2 sync, MyCAVax SEW reporting, or CDPH site-visit readiness. Health Canopy does, natively.
3. **From temperature alarm to protected doses in one minute** — the excursion scenario shows detection → assessment (doses/dollars at risk) → action (transfer + MyCAVax logging) across the whole platform, live.
4. **County-aware AI** — forecasts blend Contra Costa Public Health surveillance, wastewater data, appointment bookings, and consumption history; recommendations name real suppliers, quantities, and costs.
5. **Built for the rollout** — 3 Martinez sites live today, 7 county health centers onboarding; the executive view shows the path to full-county coverage.
6. **Audit-ready, always** — continuous DDL logging replaces paper temp logs; every dose scan writes a five-system audit trail.

---

## Running the App

```bash
npm install
npm run dev            # http://localhost:3000
```

Optional (live AI assistant): set `ANTHROPIC_API_KEY=sk-ant-...` in `.env.local`.
Clerk keys are required for sign-in (already configured in `.env.local`).
