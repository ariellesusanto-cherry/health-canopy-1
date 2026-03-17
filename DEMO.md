# Health Canopy — Demo Guide

**AI-powered hospital inventory intelligence that unifies supply chain visibility across every PAR location, department, and supply chain in your facility.**

## What This App Does

Health Canopy replaces the 3-5 disconnected software systems hospitals use today with a single platform that connects every supply chain — Med/Surg, Pharmacy/ADC, Surgical/OR, and Lab — into one unified view. It combines real-time inventory tracking with AI-powered demand forecasting, Joint Commission compliance monitoring, and automated procurement workflows.

The demo is configured for **UCSF Medical Center** (UCSF Health system), a major academic medical center with 5 campuses (Parnassus Heights, Mission Bay, Mount Zion, Benioff Children's SF, Benioff Children's Oakland), 12 departments, ~148 PAR locations, and ~41,300 tracked SKUs.

---

## Pages & What to Show

### 1. Dashboard (`/`)

**The "single pane of glass" for hospital operations.**

- **KPI Row**: Total SKUs (41,333), PAR locations monitored (148 across 5 campuses), active alerts (14, 3 critical), monthly spend vs. budget ($2.57M, -6.5%)
- **Supply Chain Status Strip**: Real-time fill rates across all 4 parallel supply chains (Med/Surg 91%, Pharmacy/ADC 84%, Surgical/OR 76% — critical, Lab 96%)
- **Items Needing Attention**: Critical/out-of-stock items (Heparin at 23% of PAR, Vicryl sutures critical, ventilator circuits out of stock) plus expiring items
- **Orders Needing Action**: Pending purchase orders with status badges (AI Recommended, Pending Approval, Approved, Submitted, In Transit) — shows supplier, cost, expected delivery
- **Cross-Location Imbalances**: Shows when one floor is hoarding supplies while another runs out. Example: Med/Surg Long 11th has nitrile gloves at 180% of PAR while Moffitt ICU is at 42%. Suggested transfer: move 800 units
- **AI Insights**: Top 3 forward-looking alerts with severity coloring — flu surge predicted (CDC data), unusual fentanyl consumption (diversion risk), surgical volume spike
- **Incoming Deliveries**: Delayed shipments with severity indicators, on-track deliveries with tracking timeline status
- **Department Consumption**: Dual bar chart comparing current usage vs. AI-predicted across all departments
- **Activity Feed**: Real-time timeline of actions (stock receipts, AI alerts, compliance events, PO updates)

### 2. Inventory (`/inventory`)

**Every item across every PAR location — searchable, filterable, actionable.**

- **Summary Cards**: Total SKUs, in-stock count, low stock, critical/OOS, expiring soon, inventory value ($), PAR location count
- **Department Quick View**: 12 clickable department buttons (including Transplant, Oncology, Neurosciences, Cardiology) — each shows item count and PAR location count. Click to filter the table
- **Filters**: Search by name/SKU/lot/supplier. Filter by category, status, and supply chain (Med/Surg, Pharmacy, Surgical, Lab)
- **Click any row** to expand the detail panel showing:
  - Full item metadata (PAR level, reorder point, unit cost, supplier)
  - **GPO Contract** reference (e.g., "Vizient #MS-2025-441")
  - **PAR Location Distribution** — where exactly this item sits across the hospital with quantities per location, storage type (Shelf, Pyxis MedStation, Omnicell, Refrigerator, Secure Cage), and floor
  - Controlled substance chain-of-custody badge (for items like Fentanyl)
- **Export**: Downloads a real CSV of all inventory data
- **Working search**: Try "heparin", "pyxis", "critical", or a SKU like "PPE-GLV"

### 3. AI Insights (`/ai-insights`)

**Current-state analysis: what's happening right now in your inventory.**

- **Status summary**: 6 cards showing in-stock, low stock, critical/OOS, expiring, on-hand value, and AI alert count
- **Consumption chart**: Actual vs. AI-predicted daily supply usage with 90% confidence bands and "Today" reference line
- **Department usage breakdown**: Current daily consumption vs. AI-predicted next 7 days. Red bars flag departments with >10% predicted increase (ED, OR, ICU)
- **Items needing attention**: Organized into Critical/OOS, Low Stock, and Expiring Soon columns with stock/PAR ratios and dollar risk
- **AI Alerts**: Anomaly detection (fentanyl consumption spike), cost optimization (vendor consolidation saving $23K/year), compliance gaps (96-hour stockpile below target)
- **Take Action / Snooze** buttons work — demonstrates the alert workflow

### 4. Forecasting (`/forecasting`)

**What the hospital will need next week, next month, and how to prepare — a general overview for the entire hospital's inventory system.**

- **Overview cards**: Predicted daily consumption (3,050 items/day, +10%), outbreak risk (HIGH — flu surge), April spend forecast ($942K, $32K over budget)
- **Demand forecast chart**: 14-day forward consumption prediction with confidence intervals. Combines historical patterns, scheduled procedures, patient census, and CDC surveillance data
- **Monthly spend forecast**: Actual vs. AI-forecasted vs. budget across 12 months
- **What-If Scenarios** — toggle between three scenarios:
  - **Normal Operations**: All metrics nominal, $59K under budget YTD
  - **Flu Surge**: 30 flu vaccination appointments booked this month (3x increase), 40% ED increase predicted. Shows impact on PPE burn rate (+56%), medication usage (+28%), 11 items at stockout risk, +$67K weekly spend. AI recommends 6 specific pre-orders (flu vaccine doses, syringes, N95s, Tamiflu, flu test kits, alcohol pads) with quantities, suppliers, and costs
  - **Supply Disruption**: Medline + Cardinal Health delayed 5 days. Shows 8 items below safety stock, 12 cases at risk, +$34.8K expedited cost. AI recommends backup vendors, cross-facility transfers, and temporary PAR increases
- **Prediction alerts**: Forward-looking AI alerts (outbreak intelligence, demand predictions) with expandable analysis, recommended actions, and projected impact

### 5. Financials (`/budget`)

**Financial tracking from budget allocation through delivery.**

- **KPIs**: Annual budget ($34.2M), YTD spend vs. budget (variance tracking), current inventory value ($5.06M on shelves), pending POs, in-transit shipments
- **Tab: Budget & Valuation**: Monthly spend vs. budget chart with AI forecast overlay. Budget allocation table by supply category (PPE, medications, surgical, lab, etc.) with AI full-year projections and variance analysis. Export button
- **Tab: Purchase Orders**: Every PO with status (AI-recommended, pending, approved, submitted, in-transit). Shows trigger reason (PAR alert, AI forecast, auto-reorder). **Approve & Submit buttons work** — click to approve a PO
- **Tab: Deliveries**: Delayed shipments with delay reason, carrier updates, inventory impact analysis, and mitigation options. On-track deliveries with visual tracking timeline. AI-projected next orders with cost estimates. Emergency order and contact supplier buttons for critical delays
- **Export buttons** download real CSVs

### 6. Supply Chain (`/analytics`)

**Vendor performance, cost optimization, and operational efficiency.**

- **KPIs**: Monthly spend ($2.57M), inventory turnover (12.8x), avg lead time (3.2 days), fill rate (96.8%), waste/expiration ($270K YTD, -12%), active vendors (24, 3 underperforming)
- **Time range toggle**: 30 Days, 90 Days, 12 Months
- **Cost trend chart**: Monthly spend vs. budget with over-budget months highlighted
- **Waste breakdown**: Expired meds (38%), damaged supplies (14%), overstocked items (32%), recalled (10%). AI recommendation for FEFO enforcement saving $18.2K/year
- **Vendor scorecard**: On-time %, fill rate %, avg lead time, order volume, spend per vendor — color-coded by performance
- **Turnover radar chart**: Actual vs. industry benchmark by department. Insight callout for OR underperformance
- **Export** downloads vendor performance CSV

### 7. Compliance (`/compliance`)

**Joint Commission continuous readiness monitoring.**

- **Readiness score gauge**: 88/100 with survey-ready / needs-attention / at-risk classification
- **Quick actions**: Run Mock Survey, Generate Audit Report, PM Status Report, 96-Hour Sustainability calculation — all produce feedback
- **Equipment & PM summary**: 10 devices, 3 overdue, 1 due soon, 6 high-risk, 3 life-support
- **Tab: Chapter Scorecard**: All 7 TJC chapters (EC, MM, IC, EM, IM, LD, NPSG) with scores, trend indicators, and expandable findings. Click to see open findings with severity, status, assignee, due date
- **Tab: Equipment Registry**: Full medical equipment inventory with risk level, life-support classification, PM status, AEM flags, and tooltips explaining each TJC standard
- **Tab: Findings & Corrective Actions**: All open findings in a sortable table with severity, status, assignee, and due dates
- **Tab: Audit Reports**: 8 report types (equipment inventory, PM completion, medication disposition, etc.) with Generate buttons

---

## Global Features

- **Command Palette Search** (top header or `Cmd+K`): Searches across all data — inventory, equipment, POs, compliance findings, AI insights, deliveries, vendors. Keyboard navigable
- **AI Assistant** (floating button, bottom-right): Chat interface that answers natural language questions about inventory, orders, compliance, and more. Try: "What's running low?" or "Show me pending purchase orders"
- **Toast notifications**: Every action button provides visual feedback
- **Export/Download**: CSV exports available on Inventory, Financials, Supply Chain, and Compliance pages

---

## Design System

The app uses a consistent semantic color system:

| Color | Meaning | Used For |
|-------|---------|----------|
| **Primary** (terracotta) | Brand / action | Buttons, active states, AI recommendations |
| **Accent** (sage green) | Positive / safe | Baseline scenarios, success states, projected impact |
| **Red** | Danger / urgent | Critical stock, high-severity alerts, flu surge |
| **Amber** | Warning / caution | Low stock, supply disruptions, medium-severity alerts |
| **Stone** | Neutral | Low-priority items, snoozed states, informational |

---

## Key Talking Points for Stakeholders

1. **Unified view across all supply chains**: One system replaces 3-5 disconnected tools. The supply chain status strip shows Med/Surg, Pharmacy/ADC, Surgical/OR, and Lab chains in one glance.

2. **Cross-location visibility solves hoarding**: The imbalance alerts detect when one floor has excess while another is critical — and suggests specific transfers with quantities.

3. **148 PAR locations monitored across 5 campuses**: Every supply room, Pyxis MedStation, Omnicell cabinet, isolation cart, and satellite pharmacy — from Parnassus to Benioff Oakland — is tracked from one dashboard.

4. **AI-powered demand forecasting**: Consumption predictions combine historical patterns, scheduled procedures, patient census, and CDC surveillance data. The flu surge scenario shows proactive vs. reactive procurement — including real-time signals like the 3x spike in flu vaccination appointments.

5. **Joint Commission always-ready**: Continuous compliance monitoring across all 7 TJC chapters, not just annual audit prep. Equipment PM tracking with AEM documentation.

6. **GPO contract awareness**: Every item shows its GPO contract tier, enabling procurement teams to maximize committed pricing and identify off-contract spend.

7. **What-if scenario planning**: Toggle between normal operations, flu surge, and supply disruption scenarios to see inventory impact and AI-recommended mitigations before problems hit.

---

## Running the App

```bash
npm install
npm run dev
# Open http://localhost:3000
```
