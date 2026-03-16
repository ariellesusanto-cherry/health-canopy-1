"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  X,
  Send,
  Search,
  Database,
  ClipboardCheck,
  Truck,
  Wrench,
  TrendingUp,
  AlertTriangle,
  Package,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToolCall = {
  name: string;
  label: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  timestamp: Date;
};

type TypingPhase =
  | { stage: "thinking" }
  | { stage: "tool-call"; label: string }
  | { stage: "generating" };

// ---------------------------------------------------------------------------
// Suggestion chips
// ---------------------------------------------------------------------------

const SUGGESTIONS = [
  { text: "What's running low right now?", icon: AlertTriangle },
  { text: "Show me pending purchase orders", icon: Truck },
  { text: "How's our flu preparedness?", icon: TrendingUp },
  { text: "What equipment has overdue maintenance?", icon: Wrench },
];

// ---------------------------------------------------------------------------
// Mock response engine
// ---------------------------------------------------------------------------

type MockResponse = {
  toolCalls: ToolCall[];
  content: string;
  thinkingMs: number;
  toolMs: number;
};

function matchResponse(input: string): MockResponse {
  const q = input.toLowerCase();

  // Low stock / running low
  if (
    q.includes("running low") ||
    q.includes("low stock") ||
    q.includes("critical") ||
    q.includes("reorder") ||
    q.includes("out of stock") ||
    q.includes("shortage")
  ) {
    return {
      toolCalls: [
        { name: "query_inventory", label: "Searching inventory database..." },
        { name: "check_reorder_points", label: "Checking reorder thresholds..." },
      ],
      thinkingMs: 800,
      toolMs: 1400,
      content: `I found **5 items** that need attention right now:

**CRITICAL** (below 25% of PAR level):
- **Vicryl 3-0 Suture** \u2014 15 units remaining (PAR: 200). Supplier: Ethicon (J&J). A PO (PO-4522) for 200 units is pending approval, expected delivery Mar 19.
- **Heparin Sodium 5000U/mL** \u2014 45 units remaining (PAR: 200). Supplier: Pfizer. PO-4521 for 200 units was submitted today, expected Mar 20.

**OUT OF STOCK:**
- **Ventilator Circuit (Adult)** \u2014 0 units (PAR: 50). Last received Feb 15 from Fisher & Paykel. AI-recommended PO-4523 has been generated for 50 units.

**LOW STOCK** (below reorder point):
- **N95 Respirator Masks** \u2014 3,200 units (reorder point: 2,500). With flu surge predicted, AI has recommended PO-4524 for 3,000 additional units from 3M Healthcare.
- **Sterile Surgical Gown (L)** \u2014 540 units (reorder point: 400, PAR: 800). PO-4526 for 300 units approved, delivery expected Mar 17.

Would you like me to fast-track any of these purchase orders?`,
    };
  }

  // Purchase orders
  if (
    q.includes("purchase order") ||
    q.includes("pending po") ||
    q.includes("pending order") ||
    q.includes("po status") ||
    q.includes("procurement")
  ) {
    return {
      toolCalls: [
        { name: "query_procurement", label: "Querying procurement system..." },
        { name: "fetch_po_status", label: "Fetching PO statuses..." },
      ],
      thinkingMs: 600,
      toolMs: 1200,
      content: `Here are all active purchase orders:

**Pending Approval (1):**
| PO | Supplier | Items | Total | ETA |
|---|---|---|---|---|
| PO-4522 | Ethicon (J&J) | Vicryl 3-0 (200), Vicryl 2-0 (100) | $2,980 | Mar 19 |

**Submitted (1):**
| PO | Supplier | Items | Total | ETA |
|---|---|---|---|---|
| PO-4521 | Pfizer | Heparin Sodium 5000U/mL (200) | $1,750 | Mar 20 |

**AI-Recommended (2):**
| PO | Supplier | Items | Total | Trigger |
|---|---|---|---|---|
| PO-4523 | Fisher & Paykel | Ventilator Circuit (50), Humidifier Chamber (25) | $1,225 | AI forecast \u2014 ICU |
| PO-4524 | 3M Healthcare | N95 Masks (3,000), Fit-Test Kit (10) | $6,000 | AI forecast \u2014 flu surge |

**In Transit (2):**
- **PO-4525** \u2014 Cardinal Health: Surgical Drape Kits, via UPS Freight, ETA Mar 17
- **PO-4526** \u2014 Medline Industries: Gloves + Gowns, via FedEx Ground, ETA Mar 17

Total pending value: **$16,720**. Want me to approve PO-4522 or convert the AI-recommended POs?`,
    };
  }

  // Flu preparedness
  if (
    q.includes("flu") ||
    q.includes("influenza") ||
    q.includes("outbreak") ||
    q.includes("preparedness") ||
    q.includes("pandemic") ||
    q.includes("respiratory surge")
  ) {
    return {
      toolCalls: [
        { name: "query_cdc_ilinet", label: "Checking CDC ILINet surveillance data..." },
        { name: "check_respiratory_inventory", label: "Auditing respiratory supply levels..." },
        { name: "run_surge_model", label: "Running demand surge model..." },
      ],
      thinkingMs: 900,
      toolMs: 2000,
      content: `**Flu Surge Intelligence Report**

CDC ILINet data shows a **34% week-over-week increase** in influenza-like illness (ILI) across Contra Costa County. Wastewater surveillance confirms rising viral load. Our model predicts a **40\u201360% increase in ED respiratory visits** within 7\u201310 days.

**Current Respiratory Supply Status:**
| Item | On Hand | PAR | Status |
|---|---|---|---|
| N95 Respirator Masks | 3,200 | 5,000 | Low |
| Rapid COVID-19 Antigen Test | 2,100 | 3,000 | Expiring Apr 30 |
| Endotracheal Tube 7.5mm | 120 | 150 | Adequate |
| Ventilator Circuit (Adult) | 0 | 50 | Out of Stock |

**AI Recommendations (auto-generated):**
1. PO-4524: 3,000 N95 masks + 10 fit-test kits from 3M Healthcare ($6,000)
2. PO-4523: 50 ventilator circuits + 25 humidifier chambers from Fisher & Paykel ($1,225)
3. Pre-order 200 units of Tamiflu and 1,500 rapid flu tests (not yet generated)

**Estimated savings vs. emergency procurement:** $45,000

The Emergency Management compliance chapter (EM) currently scores 84%. Approving these POs would help close the 96-hour sustainability gap identified in finding FND-006.

Want me to generate the additional POs for Tamiflu and flu tests?`,
    };
  }

  // Equipment maintenance
  if (
    q.includes("equipment") ||
    q.includes("maintenance") ||
    q.includes("overdue") ||
    q.includes("pm status") ||
    q.includes("preventive maintenance") ||
    q.includes("biomedical")
  ) {
    return {
      toolCalls: [
        { name: "query_equipment_registry", label: "Scanning equipment registry..." },
        { name: "check_pm_schedule", label: "Checking PM schedules..." },
      ],
      thinkingMs: 700,
      toolMs: 1300,
      content: `**Equipment Maintenance Summary**

Found **3 items with overdue preventive maintenance:**

| Equipment | Model | Dept | Last PM | Overdue By | Risk |
|---|---|---|---|---|---|
| Infusion Pump | Alaris 8015 | Med/Surg | Nov 10, 2025 | 33 days | High |
| Ultrasound System | LOGIQ E10s | ED | Oct 15, 2025 | 60 days | Medium |
| Fetal Monitor | Series 700 | L&D | Dec 1, 2025 | 14 days | High |

**Compliance Impact:**
- Finding FND-001: 3 infusion pumps in Med/Surg not in equipment inventory registry (assigned to Biomed Engineering, due Mar 22)
- Finding FND-002: Ultrasound PM overdue 60 days (due Mar 20)
- Finding FND-007: Fetal Monitor not classified as high-risk despite continuous intrapartum monitoring use (due Mar 23)

**Due Soon (next 30 days):**
- Patient Monitor (IntelliVue MX800) \u2014 ICU, due Mar 20
- Anesthesia Machine (Aisys CS2) \u2014 OR, due Apr 5
- Ventilator (Puritan Bennett 980) \u2014 ICU, due Apr 15

The 3 overdue items are contributing to the Environment of Care (EC) compliance score being at 87%. Resolving these could improve it by an estimated 4\u20135 points.

Should I generate work orders for the overdue items?`,
    };
  }

  // Compliance
  if (
    q.includes("compliance") ||
    q.includes("joint commission") ||
    q.includes("tjc") ||
    q.includes("readiness") ||
    q.includes("audit") ||
    q.includes("findings")
  ) {
    return {
      toolCalls: [
        { name: "query_compliance_engine", label: "Pulling compliance data..." },
        { name: "check_open_findings", label: "Checking open findings..." },
      ],
      thinkingMs: 700,
      toolMs: 1100,
      content: `**Joint Commission Readiness: 88%**

**Chapter Scores:**
| Chapter | Score | Trend | Findings |
|---|---|---|---|
| Information Management | 95% | Stable | 1 |
| Medication Management | 92% | Stable | 3 |
| Leadership | 91% | Stable | 3 |
| National Patient Safety Goals | 89% | Improving | 2 |
| Environment of Care | 87% | Improving | 5 |
| Emergency Management | 84% | Improving | 4 |
| Infection Prevention & Control | 78% | Declining | 6 |

**High-Priority Open Findings (4):**
- FND-001: 3 infusion pumps missing from registry \u2014 due Mar 22
- FND-002: Ultrasound PM overdue 60 days \u2014 due Mar 20
- FND-004: Hand hygiene dispensers empty in 4/12 areas \u2014 due Mar 16 (TOMORROW)
- FND-007: Fetal Monitor risk classification incorrect \u2014 due Mar 23

Infection Prevention (IC) at 78% is the biggest concern \u2014 it's declining due to findings around hand hygiene supplies (FND-004), PPE levels on isolation carts (FND-005), and N95 fit-testing gaps (FND-008).

Want me to drill into any specific chapter or finding?`,
    };
  }

  // Deliveries / shipments
  if (
    q.includes("delivery") ||
    q.includes("deliveries") ||
    q.includes("shipment") ||
    q.includes("in transit") ||
    q.includes("tracking") ||
    q.includes("arriving")
  ) {
    return {
      toolCalls: [
        { name: "query_logistics", label: "Checking shipment tracking..." },
      ],
      thinkingMs: 500,
      toolMs: 900,
      content: `**Upcoming Deliveries:**

**Out for Delivery Today (Mar 15):**
- **DEL-8903** from BD Medical via UPS Ground
  - IV Catheter 20G (300 units)
  - IV Catheter 18G (200 units)
  - Blood Collection Tubes EDTA (2,000 units)
  - Value: $2,425

**Expected Mar 17:**
- **DEL-8901** from Cardinal Health via UPS Freight \u2014 In Transit
  - Surgical Drape Kit \u2014 Total Knee (30) + Hip (20)
  - Value: $1,780

- **DEL-8902** from Medline Industries via FedEx Ground \u2014 Picked Up
  - Nitrile Gloves M (5,000) + L (3,000), Surgical Gowns (300)
  - Value: $2,985

Total inbound value: **$7,190**

Want me to set up receiving alerts for any of these?`,
    };
  }

  // Budget / spending
  if (
    q.includes("budget") ||
    q.includes("spending") ||
    q.includes("spend") ||
    q.includes("cost") ||
    q.includes("financial") ||
    q.includes("over budget")
  ) {
    return {
      toolCalls: [
        { name: "query_financials", label: "Pulling budget data..." },
        { name: "analyze_spend_trends", label: "Analyzing spending trends..." },
      ],
      thinkingMs: 600,
      toolMs: 1100,
      content: `**Budget Overview \u2014 FY 2026 YTD**

Total annual budget: **$11.4M** across all categories.
YTD spend through March: **$4.87M** (42.7% of annual budget, 5 months in = on track).

**Categories Over Budget YTD:**
- PPE & Safety: $642K spent vs. $592K budgeted (+$50K / 8.4% over)
- Controlled Substances: $295K vs. $283K (+$12K / 4.2% over)
- Surgical Supplies: $1.38M vs. $1.33M (+$47K / 3.5% over)

**AI Cost-Saving Opportunity:**
Vendor consolidation for nitrile gloves across 4 locations could save **$23,400/year**. Currently using 3 vendors at $0.09\u2013$0.15/unit; consolidating to Medline at $0.10/unit.

March spend so far: $568K with a forecast of $895K (under the $915K budget).

Would you like a breakdown by department or supplier?`,
    };
  }

  // Consumption / analytics / trends
  if (
    q.includes("consumption") ||
    q.includes("usage") ||
    q.includes("trend") ||
    q.includes("analytics") ||
    q.includes("forecast") ||
    q.includes("demand")
  ) {
    return {
      toolCalls: [
        { name: "analyze_consumption", label: "Analyzing consumption patterns..." },
        { name: "run_forecast_model", label: "Running demand forecast model..." },
      ],
      thinkingMs: 700,
      toolMs: 1500,
      content: `**Consumption & Demand Forecast**

**Departments with Highest Predicted Increases (next 2 weeks):**
| Department | Current | Predicted | Change |
|---|---|---|---|
| ICU | 1,800 items/wk | 2,100 | +16.7% |
| OR | 2,200 items/wk | 2,450 | +11.4% |
| ED | 2,800 items/wk | 3,100 | +10.7% |

**Key Driver:** Surgical volume spike week of Mar 23 \u2014 28 total knee replacements and 15 hip replacements booked (vs. 18 and 9 typical).

**Anomaly Detected:**
Fentanyl usage in ICU has increased **47% over 5 days** without corresponding census/acuity increase. Flagged for pharmacy review and controlled substance audit.

**Supply Projections at Risk:**
- Vicryl 3-0 Sutures: Current stock (15) will be depleted by Mar 17 at projected OR consumption. PO-4522 delivery (Mar 19) may not arrive in time.
- Sterile Surgical Gowns: 540 units vs. projected need of 680 for next week.

Want me to model an alternative scenario or drill into a specific department?`,
    };
  }

  // Expiring / expiration
  if (
    q.includes("expir") ||
    q.includes("shelf life") ||
    q.includes("waste") ||
    q.includes("expired")
  ) {
    return {
      toolCalls: [
        { name: "scan_expiration_dates", label: "Scanning expiration database..." },
      ],
      thinkingMs: 600,
      toolMs: 1000,
      content: `**Expiration Alerts**

**Expiring Within 90 Days:**
| Item | Qty | Lot | Expires | Dept |
|---|---|---|---|---|
| Propofol 200mg/20mL | 180 | LT-2026-0198 | Jun 15, 2026 | Pharmacy |
| Rapid COVID-19 Antigen Test | 2,100 | LT-2026-0567 | Apr 30, 2026 | ED |

**COVID Test Waste Risk:**
At current consumption (~45 tests/day), approximately **1,075 tests will expire unused**. Potential waste: $5,644.

**AI Recommendation:** Redistribute excess COVID tests to Health Center locations (Richmond, Pittsburg, Concord) or coordinate with County Public Health for community testing events.

Want me to initiate a redistribution request?`,
    };
  }

  // Supplier performance
  if (
    q.includes("supplier") ||
    q.includes("vendor") ||
    q.includes("on-time") ||
    q.includes("lead time")
  ) {
    return {
      toolCalls: [
        { name: "query_supplier_metrics", label: "Pulling supplier scorecards..." },
      ],
      thinkingMs: 600,
      toolMs: 1000,
      content: `**Supplier Performance Scorecards**

| Supplier | On-Time | Fill Rate | Avg Lead | Orders | Spend |
|---|---|---|---|---|---|
| Medtronic | 97.3% | 99.1% | 4.1 days | 28 | $412K |
| Medline Industries | 96.2% | 98.5% | 2.1 days | 142 | $287K |
| McKesson | 94.1% | 96.9% | 2.3 days | 120 | $342K |
| Cardinal Health | 93.8% | 97.2% | 2.8 days | 98 | $214K |
| BD Medical | 91.5% | 95.8% | 3.4 days | 76 | $178K |
| Pfizer | 89.7% | 94.1% | 5.2 days | 34 | $156K |

**Concern:** Pfizer's on-time rate (89.7%) is below the 92% benchmark. Their average lead time of 5.2 days is the longest. This is relevant for the pending Heparin order (PO-4521).

Want me to flag the Heparin order for expedited shipping?`,
    };
  }

  // Default / fallback
  return {
    toolCalls: [
      { name: "search_knowledge_base", label: "Searching Health Canopy knowledge base..." },
    ],
    thinkingMs: 600,
    toolMs: 900,
    content: `I can help you with a wide range of hospital inventory questions. Here are some things I have access to:

- **Inventory levels** \u2014 real-time stock, PAR levels, reorder points, expiration tracking
- **Purchase orders** \u2014 pending, approved, in-transit, and AI-recommended POs
- **Equipment maintenance** \u2014 PM schedules, overdue items, risk classifications
- **Compliance** \u2014 Joint Commission readiness scores, open findings, chapter-by-chapter breakdown
- **Deliveries** \u2014 shipment tracking, ETAs, receiving schedules
- **Budget & spending** \u2014 YTD vs. budget, cost-saving opportunities, forecasts
- **AI analytics** \u2014 consumption trends, demand forecasting, anomaly detection
- **Supplier performance** \u2014 on-time rates, fill rates, lead times

Try asking me something specific, like "What items are critically low?" or "Show me today's deliveries."`,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState<TypingPhase | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // scroll to bottom whenever messages or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const simulateResponse = useCallback(async (userText: string) => {
    const mock = matchResponse(userText);

    // Phase 1: thinking
    setTyping({ stage: "thinking" });
    await delay(mock.thinkingMs);

    // Phase 2: tool calls one-by-one
    const completedTools: ToolCall[] = [];
    for (const tool of mock.toolCalls) {
      setTyping({ stage: "tool-call", label: tool.label });
      await delay(mock.toolMs / mock.toolCalls.length);
      completedTools.push(tool);
    }

    // Phase 3: generating
    setTyping({ stage: "generating" });
    await delay(500);

    // Done
    setTyping(null);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: mock.content,
        toolCalls: completedTools,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg || typing) return;

      setShowSuggestions(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: msg,
          timestamp: new Date(),
        },
      ]);
      setInput("");
      simulateResponse(msg);
    },
    [input, typing, simulateResponse],
  );

  return (
    <>
      {/* ----- Floating trigger button ----- */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center",
          "w-14 h-14 rounded-full shadow-lg",
          "bg-gradient-to-br from-primary to-accent text-white",
          "hover:shadow-xl hover:scale-105 active:scale-95",
          "transition-all duration-200",
          isOpen && "pointer-events-none opacity-0 scale-75",
        )}
      >
        <Sparkles className="w-6 h-6" />
        {/* pulse ring */}
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-40" />
      </button>

      {/* ----- Chat panel ----- */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col",
          "w-[420px] max-h-[min(680px,calc(100vh-3rem))]",
          "rounded-2xl border border-border bg-card shadow-2xl",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none",
        )}
      >
        {/* ---- Header ---- */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border rounded-t-2xl bg-gradient-to-r from-primary to-primary-dark">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-sm leading-tight">
              Health Canopy AI
            </h2>
            <p className="text-white/60 text-xs">
              Inventory intelligence assistant
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close AI Assistant"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ---- Message area ---- */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {/* Welcome message when empty */}
          {messages.length === 0 && !typing && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Hi! I&apos;m your inventory AI assistant.
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed max-w-[280px] mx-auto">
                  I have real-time access to inventory levels, purchase orders,
                  equipment maintenance, compliance data, and more.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {typing && <TypingIndicator phase={typing} />}

          <div ref={messagesEndRef} />
        </div>

        {/* ---- Suggestion chips ---- */}
        {showSuggestions && messages.length === 0 && !typing && (
          <div className="px-4 pb-2">
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSend(s.text)}
                  className={cn(
                    "flex items-start gap-2 px-3 py-2.5 rounded-xl text-left",
                    "border border-border bg-background",
                    "hover:border-primary/30 hover:bg-primary/[0.03]",
                    "transition-colors text-xs leading-snug text-foreground",
                  )}
                >
                  <s.icon className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---- Input ---- */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about inventory, orders, compliance..."
              disabled={!!typing}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/70 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || !!typing}
              aria-label="Send message"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                "transition-all duration-150",
                input.trim() && !typing
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-border/50 text-muted cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-muted text-center mt-2">
            AI assistant with live inventory system access
          </p>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          isUser
            ? "bg-primary/10 text-primary"
            : "bg-gradient-to-br from-primary to-accent text-white",
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "bg-primary text-white rounded-tr-md"
            : "bg-background border border-border rounded-tl-md",
        )}
      >
        {/* Tool call badges (assistant only) */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {message.toolCalls.map((tc) => (
              <ToolBadge key={tc.name} tool={tc} />
            ))}
          </div>
        )}

        {/* Content rendered as simple markdown */}
        <div className={cn("space-y-2", !isUser && "text-foreground")}>
          <MarkdownContent content={message.content} />
        </div>
      </div>
    </div>
  );
}

function ToolBadge({ tool }: { tool: ToolCall }) {
  const IconMap: Record<string, typeof Search> = {
    query_inventory: Package,
    check_reorder_points: AlertTriangle,
    query_procurement: Truck,
    fetch_po_status: ClipboardCheck,
    query_cdc_ilinet: TrendingUp,
    check_respiratory_inventory: Package,
    run_surge_model: TrendingUp,
    query_equipment_registry: Wrench,
    check_pm_schedule: Wrench,
    query_compliance_engine: ClipboardCheck,
    check_open_findings: AlertTriangle,
    query_logistics: Truck,
    query_financials: Database,
    analyze_spend_trends: TrendingUp,
    analyze_consumption: TrendingUp,
    run_forecast_model: TrendingUp,
    scan_expiration_dates: AlertTriangle,
    query_supplier_metrics: Database,
    search_knowledge_base: Search,
  };
  const Icon = IconMap[tool.name] ?? Search;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/8 border border-accent/15 text-[11px] font-medium text-accent">
      <Icon className="w-3 h-3" />
      {tool.name}
    </span>
  );
}

function TypingIndicator({ phase }: { phase: TypingPhase }) {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-background border border-border px-4 py-3 max-w-[85%]">
        {phase.stage === "thinking" && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <ThinkingDots />
            <span>Thinking...</span>
          </div>
        )}
        {phase.stage === "tool-call" && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-accent font-medium">
              <LoadingSpinner />
              <span>{phase.label}</span>
            </div>
          </div>
        )}
        {phase.stage === "generating" && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <ThinkingDots />
            <span>Generating response...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="w-3.5 h-3.5 animate-spin text-accent"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Minimal markdown renderer (no deps)
// ---------------------------------------------------------------------------

function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split("\n\n");

  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Table detection
        if (trimmed.includes("|") && trimmed.includes("---")) {
          return <MarkdownTable key={i} raw={trimmed} />;
        }

        // Lines within a block
        const lines = trimmed.split("\n");
        return (
          <div key={i}>
            {lines.map((line, j) => (
              <MarkdownLine key={j} line={line} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function MarkdownTable({ raw }: { raw: string }) {
  const rows = raw
    .split("\n")
    .filter((r) => !r.trim().match(/^\|[\s-|]+\|$/));
  if (rows.length === 0) return null;

  const parseCells = (row: string) =>
    row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

  const header = parseCells(rows[0]);
  const body = rows.slice(1).map(parseCells);

  return (
    <div className="overflow-x-auto -mx-1 my-1">
      <table className="w-full text-[11px]">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="text-left px-1.5 py-1 font-semibold text-muted border-b border-border whitespace-nowrap"
              >
                <InlineMarkdown text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-border/50 last:border-0">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-1.5 py-1 text-foreground whitespace-nowrap"
                >
                  <InlineMarkdown text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownLine({ line }: { line: string }) {
  const trimmed = line.trim();

  // Heading
  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
    return (
      <p className="font-semibold text-foreground">
        <InlineMarkdown text={trimmed} />
      </p>
    );
  }

  // Numbered list item
  if (/^\d+\.\s/.test(trimmed)) {
    return (
      <p className="pl-2">
        <InlineMarkdown text={trimmed} />
      </p>
    );
  }

  // Bullet
  if (trimmed.startsWith("- ")) {
    return (
      <p className="pl-2 flex gap-1">
        <span className="text-muted shrink-0">&bull;</span>
        <span>
          <InlineMarkdown text={trimmed.slice(2)} />
        </span>
      </p>
    );
  }

  return (
    <p>
      <InlineMarkdown text={trimmed} />
    </p>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Handle em-dash-separated segments and code-like fragments
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
