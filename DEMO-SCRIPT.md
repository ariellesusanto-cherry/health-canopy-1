# Health Canopy — 5-Minute Demo Script (Contra Costa Health)

**Audience:** Contra Costa Health leadership — supply chain, pharmacy, immunization program, and operations.
**Setup before the room fills:** `npm run dev`, sign in, choose **Supply Chain Manager**, land on the Dashboard. Press `Shift+D` once to confirm the Demo Director opens, then close it. Reset simulation if you rehearsed.

---

## Opening (20 sec)

> "Today Contra Costa runs supply chain, vaccine cold chain, VFC compliance, and controlled-substance monitoring in separate systems — plus paper temperature logs in the clinics. Health Canopy is one platform for all of it, built for county health systems. Everything you're about to see is CCRMC and the Martinez clinics, with the other seven county health centers in the onboarding queue."

---

## 1. Dashboard — One Pane for the Whole System (60 sec)

**Stay on `/`.**

> "18,470 SKUs across 34 PAR locations — the hospital and both Martinez clinics in one view."

**Point at the Surgical/OR chain (highlighted red):**
> "The system is telling you where to look: Surgical/OR is at 74% fill because of a suture shortage — and there's already a PO pending approval for it."

**Point at Items Needing Attention:**
> "Notice these aren't just med/surg items. Those VFC badges are short-dated vaccine lots — MMR at Martinez Wellness expiring April 18. The system's suggestion: use first per FIFO, or transfer to another VFC provider through MyCAVax. That's county-health-specific intelligence."

**Point at Cross-Location Imbalances:**
> "And it catches imbalances between sites — Wellness has 165% of PAR on MMR while the Health Center is at 35% with well-child visits scheduled. Suggested transfer: 12 doses. One click."

---

## 2. Cold Chain — The Live Wire (75 sec)

**Click `Cold Chain` in the sidebar.**

> "Every vaccine storage unit in the county on continuous digital data loggers — this is live telemetry, not a twice-a-day paper log. The green band is the CDC range, 36 to 46."

**Select the Martinez Wellness VFC fridge:**
> "This unit has been drifting warm for about sixteen hours — 43 degrees and climbing. Still in range, but watch what happens when it isn't."

**Press `Shift+D` → Trigger fridge excursion. Narrate as it climbs (~20 sec):**
> "The moment it crosses 46… there's the alarm. 198 VFC doses, eleven lots, about $14,000 at risk. And this isn't just a text message to whoever's on call — look at the sidebar badge, and the AI has already written the response plan: move stock to the backup unit, mark doses do-not-use, log the excursion in MyCAVax, dispatch the repair vendor."

**Click "Move doses to backup unit":**
> "One click executes it. Temperature recovering, transfer logged, excursion documented for CDPH. From alarm to protected doses in under a minute — that's the difference between continuous monitoring and finding a warm fridge Monday morning."

**Click `Dashboard` briefly:** the excursion insight is at the top of AI Insights and in the activity feed.
> "And the whole event is already on the operations dashboard and the audit trail."

---

## 3. Vaccine Mgmt — VFC Without the Binder (60 sec)

**Click `Vaccine Mgmt`.**

> "Your VFC plan is usually a binder. Here it's a living system — coordinators, training status, equipment and data logger documentation with calibration countdowns, and the full task schedule from twice-daily temp checks to annual recertification."

**Scroll to the Point-of-Care Scan Inspector, expand a scan:**
> "This is the workflow that matters: a nurse scans the vial's barcode once. That one scan posts to ccLink, submits to CAIR2, decrements the right fridge, logs to MyCAVax, and writes the audit trail — five systems, zero double entry. And the scanner blocks the dose if the lot's expired or a VFC-eligible child was matched against private stock."

---

## 4. AI — Forecasting + Ask Anything (75 sec)

**Click `Forecasting`, then the "Respiratory Surge" scenario:**
> "County surveillance shows respiratory illness up 28% week over week — East County highest, wastewater confirming. If the surge hits, here's the impact: PPE burn up 56%, Tamiflu stocks out, eleven items at risk. The AI's already built the pre-order list — vaccines, Tamiflu, rapid tests, N95s — with quantities split across the three sites. Ordering now versus emergency procurement saves about $18,000."

**Open the AI assistant (sparkle button). Ask: "Which fridge should I be worried about right now?"** *(live mode)*
> "This is the same AI your staff can just… ask. It's reading the actual telemetry — including the excursion we just ran — and answering with the numbers on screen."

*(Fallback if no API key: click the "What items are critically low right now?" suggestion instead.)*

---

## 5. Close — Executive View (30 sec)

**Switch role → Executive.**

> "For leadership: read-only, one page — compliance readiness at 88, site-level status, spend against budget. And here's the rollout: three sites live today, seven health centers onboarding — Antioch, Pittsburg, Concord, San Pablo, Brentwood, North Richmond, Bay Point. Full-county coverage on one platform, priced for a county health system — not four separate vendors."

> "We'd love to set up a working session with your supply chain, pharmacy, and immunization teams."

---

**Total: ~5 minutes.**

## Rehearsal notes

- `Shift+D` toggles the Demo Director; **Reset simulation** restores the baseline between run-throughs.
- The excursion takes ~20–30 seconds to cross the alarm after triggering — start narrating the drift story while it climbs.
- Demo clock is Mon Mar 16, 2026; don't mention today's real date.
- If asked about integrations: ccLink (Epic) via HL7/FHIR, CAIR2 via HL7, MyCAVax via CDPH interfaces — the demo simulates the fan-out per scan.
