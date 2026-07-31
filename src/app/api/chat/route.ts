// ============================================================
// Live AI assistant — Claude with tool use over the demo dataset.
// ------------------------------------------------------------
// The client POSTs { messages, fridges } where `fridges` is the
// live cold-chain snapshot from the client-side simulation, so
// the model answers with the same numbers on screen.
//
// Responds with NDJSON lines:
//   {type:"tool", name}      — a tool call started
//   {type:"text", delta}     — assistant text chunk
//   {type:"done"} | {type:"error", message}
//
// Requires ANTHROPIC_API_KEY in .env.local. Without it the route
// returns 503 and the client falls back to the scripted engine.
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { tenants, DEFAULT_TENANT } from "@/lib/tenants";
import {
  inventoryItems,
  itemLocations,
  upcomingPurchaseOrders,
  upcomingDeliveries,
  delayedShipments,
  complianceChapters,
  complianceFindings,
  overallReadinessScore,
  equipmentRegistry,
  aiInsights,
  budgetAllocation,
  monthlyCostTrend,
  supplierPerformance,
  departmentConsumption,
  demandForecastData,
} from "@/lib/mock-data";

export const runtime = "nodejs";

type LiveFridge = {
  unitId: string;
  siteName: string;
  kind: string;
  tempF: number;
  status: string;
  doseCount: number;
  lotCount: number;
};

const tenant = tenants[DEFAULT_TENANT];

const SYSTEM = `You are the Health Canopy AI assistant for ${tenant.name} (${tenant.system}) — an AI-powered supply chain and vaccine management platform.

Facility context:
- Sites: ${tenant.sites.map((s) => `${s.name} (${s.type}, ${s.city})`).join("; ")}
- ${tenant.metrics.totalSKUs} SKUs tracked across ${tenant.metrics.parLocationCount} PAR locations
- EHR: ccLink (Epic). Immunization registry: ${tenant.vfcCompliance.registry}. VFC accountability: MyCAVax (CDPH).
- Today's date is March 16, 2026.

Rules:
- ALWAYS ground answers in tool results — call the relevant tool(s) before answering. Never invent stock numbers, PO numbers, or dates.
- Be concise and operational. Lead with the answer, then supporting detail.
- Use markdown: **bold** for emphasis, tables for lists of items (keep tables ≤5 columns), bullets sparingly.
- When an item is a VFC vaccine, note VFC-specific handling (FIFO, MyCAVax transfer, CAIR2 reporting) where relevant.
- End with one short, concrete offer of a next step when natural.
- If asked something outside the dataset (e.g. general medical advice), say what you do have access to instead.
- This is a demo environment with synthetic data; do not mention this unless asked.`;

function compactItem(i: (typeof inventoryItems)[number]) {
  return {
    id: i.id,
    name: i.name,
    department: i.department,
    sku: i.sku,
    stock: i.currentStock,
    par: i.parLevel,
    reorderPoint: i.reorderPoint,
    unitCost: i.unitCost,
    status: i.status,
    expirationDate: i.expirationDate,
    supplier: i.supplier,
    supplyChain: i.supplyChain,
    gpoContract: i.gpoContract,
  };
}

function buildTools(liveFridges: LiveFridge[] | undefined) {
  return [
    betaTool({
      name: "query_inventory",
      description:
        "Search the live inventory. Filter by free-text query (name/SKU/supplier), status, and/or department. Returns up to 25 matching items with stock, PAR, reorder point, cost, expiration, supplier.",
      inputSchema: {
        type: "object" as const,
        properties: {
          query: { type: "string", description: "Free text match on name, SKU, category, or supplier" },
          status: {
            type: "string",
            enum: ["in-stock", "low-stock", "critical", "out-of-stock", "expiring-soon"],
          },
          department: { type: "string" },
        },
      },
      run: (input) => {
        const q = (input.query as string | undefined)?.toLowerCase();
        const status = input.status as string | undefined;
        const dept = (input.department as string | undefined)?.toLowerCase();
        let items = inventoryItems;
        if (q)
          items = items.filter(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              i.sku.toLowerCase().includes(q) ||
              i.category.toLowerCase().includes(q) ||
              i.supplier.toLowerCase().includes(q)
          );
        if (status) items = items.filter((i) => i.status === status);
        if (dept) items = items.filter((i) => i.department.toLowerCase().includes(dept));
        return JSON.stringify({
          matchCount: items.length,
          items: items.slice(0, 25).map(compactItem),
        });
      },
    }),

    betaTool({
      name: "get_attention_items",
      description:
        "Items needing attention right now (critical, out-of-stock, expiring VFC vaccines) plus suggested cross-site transfer recommendations to fix imbalances.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () =>
        JSON.stringify({
          itemsNeedingAttention: tenant.itemsNeedingAttention,
          suggestedTransfers: tenant.locationImbalances,
        }),
    }),

    betaTool({
      name: "get_item_locations",
      description:
        "Where a specific inventory item physically sits — PAR location distribution with quantities, storage type (Pyxis, fridge, shelf), and floor. Input the item id (e.g. INV-009).",
      inputSchema: {
        type: "object" as const,
        properties: {
          item_id: { type: "string", description: "Inventory id like INV-009" },
        },
        required: ["item_id"],
      },
      run: (input) => {
        const locs = itemLocations[input.item_id as string];
        return JSON.stringify(locs ?? { error: "No location data for that item id" });
      },
    }),

    betaTool({
      name: "get_procurement",
      description:
        "Purchase orders (all statuses incl. AI-recommended), incoming deliveries with tracking, and delayed shipments with impact analysis and mitigation options.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () =>
        JSON.stringify({
          purchaseOrders: upcomingPurchaseOrders,
          incomingDeliveries: upcomingDeliveries,
          delayedShipments: delayedShipments.map((d) => ({
            id: d.id,
            poId: d.poId,
            supplier: d.supplier,
            items: d.items,
            totalCost: d.totalCost,
            originalEta: d.originalEta,
            revisedEta: d.revisedEta,
            delayDays: d.delayDays,
            reason: d.reason,
            impactSeverity: d.impactSeverity,
            inventoryImpact: d.inventoryImpact,
            mitigationOptions: d.mitigationOptions,
          })),
        }),
    }),

    betaTool({
      name: "get_cold_chain",
      description:
        "Live cold chain status: current temperature, alarm status, and dose counts for every vaccine storage unit (VFC + private fridges and the pharmacy freezer), plus data logger calibration dates.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () =>
        JSON.stringify({
          liveUnits:
            liveFridges ??
            tenant.coldChain.flatMap((s) =>
              s.fridges.map((f) => ({
                siteName: s.siteName,
                kind: f.type,
                tempF: f.tempF,
                status: f.status,
                doseCount: f.doseCount,
                lotCount: f.lotCount,
              }))
            ),
          equipment: tenant.vfcEquipment,
          alarmRangeF: "36–46 refrigerators; -22–5 freezer",
        }),
    }),

    betaTool({
      name: "get_vfc_program",
      description:
        "VFC (Vaccines for Children) program status: enrollment/recertification, coordinators, task schedule (temp logs, inventory, FIFO), SEW (spoiled/expired/wasted) reports, recent dose scans with registry sync status, and key contacts.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () =>
        JSON.stringify({
          compliance: tenant.vfcCompliance,
          roles: tenant.vfcRoles.map((r) => ({
            role: r.role,
            name: r.name,
            trainingComplete: r.trainingComplete,
          })),
          tasks: tenant.vfcTasks,
          sewReports: tenant.vfcSEW,
          recentScans: tenant.vfcScans,
          contacts: tenant.vfcContacts,
        }),
    }),

    betaTool({
      name: "get_compliance",
      description:
        "Joint Commission readiness: overall score, all 7 chapter scores with trends, open findings with severity/assignee/due dates, and the medical equipment registry with PM status.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () =>
        JSON.stringify({
          overallReadinessScore,
          chapters: complianceChapters,
          findings: complianceFindings,
          equipmentRegistry,
        }),
    }),

    betaTool({
      name: "get_financials",
      description:
        "Budget vs actual spend (monthly trend + category allocation), analytics KPIs (turnover, fill rate, lead time, waste), and supplier performance scorecards.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () => {
        const scale = tenant.financialScale;
        return JSON.stringify({
          note: "Dollar figures already scaled to this facility.",
          monthlySpendVsBudget: monthlyCostTrend.map((m) => ({
            month: m.month,
            actual: Math.round(m.actual * scale),
            budget: Math.round(m.budget * scale),
          })),
          budgetAllocation: budgetAllocation.map((b) => {
            const rec = b as Record<string, number | string>;
            const out: Record<string, number | string> = {};
            for (const [k, v] of Object.entries(rec)) {
              out[k] = typeof v === "number" ? Math.round(v * scale) : v;
            }
            return out;
          }),
          kpis: tenant.analyticsMetrics,
          suppliers: supplierPerformance,
        });
      },
    }),

    betaTool({
      name: "get_forecast_and_insights",
      description:
        "AI outputs: active insights/alerts (outbreak intel, anomalies incl. the fentanyl consumption spike, cost savings), 14-day demand forecast, per-department consumption predictions, and the respiratory surge scenario for Contra Costa County.",
      inputSchema: { type: "object" as const, properties: {} },
      run: () =>
        JSON.stringify({
          surgeInsight: tenant.surgeInsight,
          insights: aiInsights,
          forecastOverview: tenant.forecastingOverview,
          dailyDemandForecast: demandForecastData,
          departmentConsumptionPerDay: departmentConsumption,
        }),
    }),
  ];
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "no_api_key" }, { status: 503 });
  }

  const body = await req.json();
  const history: { role: "user" | "assistant"; content: string }[] =
    body.messages ?? [];
  const liveFridges: LiveFridge[] | undefined = body.fridges;

  const client = new Anthropic();
  const runner = client.beta.messages.toolRunner({
    model: "claude-opus-5",
    max_tokens: 2048,
    system: SYSTEM,
    output_config: { effort: "low" },
    messages: history,
    tools: buildTools(liveFridges),
    stream: true,
    max_iterations: 6,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        for await (const messageStream of runner) {
          for await (const event of messageStream) {
            if (
              event.type === "content_block_start" &&
              event.content_block.type === "tool_use"
            ) {
              emit({ type: "tool", name: event.content_block.name });
            } else if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              emit({ type: "text", delta: event.delta.text });
            }
          }
        }
        emit({ type: "done" });
      } catch (err) {
        emit({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
