"use client";

import { Fragment, useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  Download,
  Plus,
  ArrowRightLeft,
  Package,
  Pill,
  ShieldAlert,
  FlaskConical,
  Scissors,
  Siren,
  HeartPulse,
  Bed,
  Baby,
  Warehouse,
  Eye,
  FileBarChart,
  RefreshCw,
  Building2,
  Stethoscope,
  Snowflake,
  Syringe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { inventoryItems, departments, itemLocations, parLocations, custodyLogs, usageAnomalies, type InventoryItem } from "@/lib/mock-data";
import { useTenant } from "@/lib/tenant-context";
import { useRole } from "@/lib/role-context";
import { MapPin } from "lucide-react";

const categoryFilters = ["All", "PPE", "Medication", "Supplies", "Surgical", "Controlled Substance", "Respiratory", "Testing", "Laboratory"];
const statusFilters = ["All", "in-stock", "low-stock", "critical", "out-of-stock", "expiring-soon"];
const departmentFilters = ["All", ...departments.map((d) => d.name)];
const supplyChainFilters = ["All", "med-surg", "pharmacy", "surgical", "lab"];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "in-stock": { label: "In Stock", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  "low-stock": { label: "Low Stock", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "critical": { label: "Critical", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  "out-of-stock": { label: "Out of Stock", color: "text-red-700", bg: "bg-red-100 border-red-300" },
  "expiring-soon": { label: "Expiring Soon", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

const deptIcons: Record<string, typeof Package> = {
  "Emergency Department": Siren,
  "Operating Rooms": Scissors,
  "Pharmacy": Pill,
  "Materials Management": Warehouse,
  "Intensive Care Unit": HeartPulse,
  "Med/Surg": Bed,
  "Labor & Delivery": Baby,
  "Laboratory": FlaskConical,
};

function StockBar({ current, par, reorder }: { current: number; par: number; reorder: number }) {
  const pct = Math.min((current / par) * 100, 100);
  const reorderPct = (reorder / par) * 100;
  const color = pct <= 25 ? "bg-red-500" : pct <= 60 ? "bg-amber-400" : "bg-accent";

  return (
    <div className="w-full">
      <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
        <div
          className="absolute top-0 h-full border-r-2 border-dashed border-stone-400"
          style={{ left: `${reorderPct}%` }}
          title={`Reorder point: ${reorder}`}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[11px] text-muted">{current.toLocaleString()} units</span>
        <Tooltip content="Periodic Automatic Replenishment — target stock level" wide>
          <span className="text-[11px] text-muted cursor-help border-b border-dotted border-muted/60">PAR: {par.toLocaleString()}</span>
        </Tooltip>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { showToast } = useToast();
  const { tenant } = useTenant();
  const { role, unit } = useRole();
  // Unit-scoped personas (Nurse / Unit Supply Coordinator) only see their
  // own unit's stock — no cross-site rollups, no other departments.
  const unitScoped = role?.dataScope === "unit";
  const scopeUnit = unitScoped ? (unit ?? role?.defaultUnit ?? "Med/Surg") : null;
  const canManage = !!role && !role.readOnly && role.dataScope === "system";
  const baseItems = useMemo(
    () => (scopeUnit ? inventoryItems.filter((i) => i.department === scopeUnit) : inventoryItems),
    [scopeUnit]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortField, setSortField] = useState<keyof InventoryItem>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedSupplyChain, setSelectedSupplyChain] = useState("All");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const selectedSite = selectedSiteId === "all"
    ? null
    : tenant.sitesInventory.find((s) => s.siteId === selectedSiteId) ?? null;
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const filtered = useMemo(() => {
    let items = [...baseItems];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.lotNumber.toLowerCase().includes(q) ||
          i.supplier.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
    }
    if (selectedStatus !== "All") {
      items = items.filter((i) => i.status === selectedStatus);
    }
    if (selectedDepartment !== "All") {
      items = items.filter((i) => i.department === selectedDepartment);
    }
    if (selectedSupplyChain !== "All") {
      items = items.filter((i) => i.supplyChain === selectedSupplyChain);
    }

    items.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

    return items;
  }, [baseItems, searchQuery, selectedCategory, selectedStatus, selectedDepartment, selectedSupplyChain, sortField, sortDir]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice((safeCurrentPage - 1) * perPage, safeCurrentPage * perPage);

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const summaryStats = useMemo(() => {
    const baseRawValue = inventoryItems.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0);
    if (unitScoped) {
      // Point-of-use view: counts come straight from the unit's items.
      return {
        total: baseItems.length,
        inStock: baseItems.filter((i) => i.status === "in-stock").length,
        lowStock: baseItems.filter((i) => i.status === "low-stock").length,
        critical: baseItems.filter((i) => i.status === "critical" || i.status === "out-of-stock").length,
        expiring: baseItems.filter((i) => i.status === "expiring-soon").length,
        totalValue: baseItems.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0),
      };
    }
    if (selectedSite) {
      const siteShare = selectedSite.totalItems / tenant.inventoryBreakdown.total;
      return {
        total: selectedSite.totalItems,
        inStock: Math.round(tenant.inventoryBreakdown.inStock * siteShare),
        lowStock: Math.round(tenant.inventoryBreakdown.lowStock * siteShare),
        critical: selectedSite.criticalAlerts,
        expiring: selectedSite.expiringSoon,
        totalValue: baseRawValue * tenant.financialScale * siteShare,
      };
    }
    return {
      ...tenant.inventoryBreakdown,
      totalValue: baseRawValue * tenant.financialScale,
    };
  }, [tenant, selectedSite, unitScoped, baseItems]);

  return (
    <div className="min-h-screen">
      <Header title="Inventory Management" subtitle={unitScoped ? `Point-of-use stock for ${scopeUnit} — your unit only` : "Real-time stock tracking across all departments and locations"} />

      <div className="p-4 md:p-8 space-y-6">
        {/* Summary Cards */}
        <div data-tour="inv-summary" className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {[
            { label: "Total SKUs", value: summaryStats.total.toLocaleString(), icon: Package, color: "text-primary bg-primary/10" },
            { label: "In Stock", value: summaryStats.inStock.toLocaleString(), icon: CheckCircle2, color: "text-accent bg-accent/10" },
            { label: "Low Stock", value: summaryStats.lowStock.toLocaleString(), icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
            { label: "Critical / OOS", value: summaryStats.critical.toLocaleString(), icon: XCircle, color: "text-red-600 bg-red-50", tooltip: "Critical stock or completely Out of Stock" },
            { label: "Expiring Soon", value: summaryStats.expiring.toLocaleString(), icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Inventory Value", value: `$${(summaryStats.totalValue / 1000).toFixed(0)}K`, icon: FileBarChart, color: "text-primary bg-primary/10" },
            { label: "PAR Locations", value: unitScoped ? String(Math.max(2, parLocations.filter((p) => p.department === scopeUnit).length)) : selectedSite ? selectedSite.parLocations : tenant.metrics.parLocationCount, icon: MapPin, color: "text-primary bg-primary/10" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted uppercase">
                  {"tooltip" in s && s.tooltip ? (
                    <Tooltip content={s.tooltip as string} position="bottom" wide>
                      <span className="cursor-help border-b border-dotted border-muted/60">{s.label}</span>
                    </Tooltip>
                  ) : s.label}
                </p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Department Quick View */}
        {/* Site Overview — click a site to filter the view (system scope only) */}
        {!unitScoped && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Site Overview
              {selectedSite && (
                <span className="ml-2 text-xs text-muted font-normal">
                  · viewing <span className="text-primary font-medium">{selectedSite.siteName}</span>
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3">
              {selectedSite && (
                <button
                  onClick={() => setSelectedSiteId("all")}
                  className="text-xs text-primary hover:underline"
                >
                  Clear filter
                </button>
              )}
              <span className="text-[11px] text-muted">
                {tenant.sitesInventory.length} {tenant.sitesInventory.length === 1 ? "site" : "sites"} · rolls up to {tenant.metrics.totalSKUs} items
              </span>
            </div>
          </div>
          <div className={cn(
            "grid gap-3",
            // +1 for the "All sites" card
            tenant.sitesInventory.length + 1 <= 4 ? "grid-cols-4" : "grid-cols-6"
          )}>
            {/* All sites card */}
            <button
              type="button"
              onClick={() => setSelectedSiteId("all")}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                selectedSiteId === "all"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-stone-50/40 hover:border-primary/30 hover:bg-stone-50"
              )}
            >
              <div className="flex items-start gap-2 mb-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  selectedSiteId === "all" ? "bg-primary/15" : "bg-primary/10"
                )}>
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-tight">All Sites</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted mt-0.5">{tenant.shortName} · system view</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p className="text-muted text-[10px] uppercase">Items</p>
                  <p className="font-bold text-foreground">{tenant.metrics.totalSKUs}</p>
                </div>
                <div>
                  <p className="text-muted text-[10px] uppercase">PAR Locs</p>
                  <p className="font-bold text-foreground">{tenant.metrics.parLocationCount}</p>
                </div>
                <div>
                  <p className="text-muted text-[10px] uppercase flex items-center gap-1">
                    <Snowflake className="w-2.5 h-2.5" /> Fridges
                  </p>
                  <p className="font-medium text-foreground">
                    <span className="text-primary">{tenant.sitesInventory.reduce((s, x) => s + x.vfcFridges, 0)} VFC</span>
                    {" · "}
                    <span className="text-muted">{tenant.sitesInventory.reduce((s, x) => s + x.privateFridges, 0)} Priv</span>
                  </p>
                </div>
                <div>
                  <p className="text-muted text-[10px] uppercase">Alerts</p>
                  <p className="font-medium text-foreground">
                    <span className="text-red-600">{tenant.sitesInventory.reduce((s, x) => s + x.criticalAlerts, 0)} crit</span>
                    {" · "}
                    <span className="text-amber-600">{tenant.sitesInventory.reduce((s, x) => s + x.expiringSoon, 0)} exp</span>
                  </p>
                </div>
              </div>
            </button>

            {tenant.sitesInventory.map((site) => {
              const SiteIcon = site.type === "hospital" ? Building2 : Stethoscope;
              const isSelected = selectedSiteId === site.siteId;
              return (
                <button
                  type="button"
                  key={site.siteId}
                  onClick={() => setSelectedSiteId(isSelected ? "all" : site.siteId)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-stone-50/40 hover:border-primary/30 hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isSelected ? "bg-primary/15" : "bg-primary/10"
                    )}>
                      <SiteIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight" title={site.siteName}>
                        {site.siteName}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-muted mt-0.5">{site.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <p className="text-muted text-[10px] uppercase">Items</p>
                      <p className="font-bold text-foreground">{site.totalItems.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase">PAR Locs</p>
                      <p className="font-bold text-foreground">{site.parLocations}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase flex items-center gap-1">
                        <Snowflake className="w-2.5 h-2.5" /> Fridges
                      </p>
                      <p className="font-medium text-foreground">
                        <span className="text-primary">{site.vfcFridges} VFC</span>
                        {" · "}
                        <span className="text-muted">{site.privateFridges} Priv</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase">Alerts</p>
                      <p className="font-medium text-foreground">
                        {site.criticalAlerts > 0 && <span className="text-red-600">{site.criticalAlerts} crit</span>}
                        {site.criticalAlerts > 0 && site.expiringSoon > 0 && " · "}
                        {site.expiringSoon > 0 && <span className="text-amber-600">{site.expiringSoon} exp</span>}
                        {site.criticalAlerts === 0 && site.expiringSoon === 0 && <span className="text-accent">None</span>}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        )}

        {!unitScoped && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Department Overview</h3>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {departments.map((dept) => {
              const DeptIcon = deptIcons[dept.name] || Package;
              const isSelected = selectedDepartment === dept.name;
              // Scale per-department counts so they roll up to tenant (or site) totals
              const siteShare = selectedSite
                ? selectedSite.totalItems / tenant.inventoryBreakdown.total
                : 1;
              const scaledItemCount = Math.max(1, Math.round(dept.itemCount * tenant.financialScale * siteShare));
              const baselinePars = 148;
              const tenantTotalPars = selectedSite ? selectedSite.parLocations : parseInt(tenant.metrics.parLocationCount, 10);
              const parScale = tenantTotalPars / baselinePars;
              const baselineDeptPars = parLocations.filter((p) => p.department === dept.name).length;
              const scaledDeptPars = Math.max(1, Math.round(baselineDeptPars * parScale));
              return (
                <button
                  key={dept.id}
                  onClick={() => { setSelectedDepartment(isSelected ? "All" : dept.name); setCurrentPage(1); }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:bg-stone-50"
                  )}
                >
                  <DeptIcon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted")} />
                  <span className="text-[11px] font-medium text-foreground leading-tight">{dept.name}</span>
                  <span className="text-[11px] text-muted">{scaledItemCount.toLocaleString()} items</span>
                  <span className="text-[11px] text-muted">
                    {scaledDeptPars} PAR locations
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        )}

        {/* Filters + Search */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search by name, SKU, lot number, or supplier..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {categoryFilters.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : statusConfig[s]?.label || s}</option>
              ))}
            </select>

            <select
              value={selectedSupplyChain}
              onChange={(e) => { setSelectedSupplyChain(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {supplyChainFilters.map((sc) => (
                <option key={sc} value={sc}>{sc === "All" ? "All Supply Chains" : sc === "med-surg" ? "Med/Surg" : sc === "pharmacy" ? "Pharmacy" : sc === "surgical" ? "Surgical" : "Laboratory"}</option>
              ))}
            </select>

            <button
              onClick={() => showToast("Add Item requires ERP integration — use the AI agent to draft a new item request", "info")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
            <button
              onClick={() => {
                const csv = [
                  ["ID", "Name", "SKU", "Category", "Department", "Stock", "PAR", "Reorder Point", "Unit Cost", "Status", "Supplier", "Expiration"].join(","),
                  ...inventoryItems.map((i) =>
                    [i.id, `"${i.name}"`, i.sku, i.category, `"${i.department}"`, i.currentStock, i.parLevel, i.reorderPoint, i.unitCost, i.status, `"${i.supplier}"`, i.expirationDate || "N/A"].join(",")
                  ),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "inventory-export.csv";
                a.click();
                URL.revokeObjectURL(url);
                showToast(`Exported ${inventoryItems.length} inventory items to CSV`);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <p className="text-xs text-muted mb-3">
            Showing {filtered.length} of {unitScoped ? baseItems.length.toLocaleString() : selectedSite ? selectedSite.totalItems.toLocaleString() : tenant.metrics.totalSKUs} items
            {selectedDepartment !== "All" && <span className="font-medium"> in {selectedDepartment}</span>}
            <span className="text-muted ml-1">
              — {unitScoped
                ? <>scoped to <span className="font-medium text-primary">{scopeUnit} (your unit)</span></>
                : selectedSite
                ? <>scoped to <span className="font-medium text-primary">{selectedSite.siteName}</span></>
                : <>across {tenant.campusCount} {tenant.shortName} {tenant.campusLabel}</>}
            </span>
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { field: "name" as const, label: "Item / SKU", width: "w-[240px]" },
                    { field: "category" as const, label: "Category", width: "w-[110px]" },
                    { field: "department" as const, label: "Department", width: "w-[130px]" },
                    { field: "currentStock" as const, label: "Stock Level", width: "w-[180px]" },
                    { field: "name" as const, label: "Locations", width: "w-[90px]" },
                    { field: "expirationDate" as const, label: "Expiration", width: "w-[100px]" },
                    { field: "supplier" as const, label: "Supplier", width: "w-[130px]" },
                    { field: "status" as const, label: "Status", width: "w-[110px]" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={cn("text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-3 py-3 cursor-pointer hover:text-foreground", col.width)}
                      onClick={() => handleSort(col.field)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => {
                  const sc = statusConfig[item.status];
                  const isExpiringSoon = item.expirationDate && new Date(item.expirationDate) < new Date("2026-07-01");

                  const isOpen = showDetail === item.id;
                  return (
                    <Fragment key={item.id}>
                    <tr
                      className={cn(
                        "border-b border-border/50 transition-colors cursor-pointer",
                        isOpen ? "bg-primary/[0.04]" : "hover:bg-stone-50/50"
                      )}
                      onClick={() => setShowDetail(isOpen ? null : item.id)}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 text-muted shrink-0 transition-transform",
                              isOpen && "rotate-180 text-primary"
                            )}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-[11px] text-muted font-mono">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-foreground">{item.category}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-foreground">{item.department}</span>
                      </td>
                      <td className="px-3 py-3">
                        <StockBar current={item.currentStock} par={item.parLevel} reorder={item.reorderPoint} />
                      </td>
                      <td className="px-3 py-3">
                        {(() => {
                          const locs = itemLocations[item.id];
                          if (!locs) return <span className="text-[11px] text-muted">—</span>;
                          return (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              <span className="text-xs font-medium text-foreground">{locs.length}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-3 py-3">
                        {item.expirationDate ? (
                          <span className={cn("text-xs", isExpiringSoon ? "text-amber-600 font-medium" : "text-foreground")}>
                            {item.expirationDate}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-foreground">{item.supplier}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full border", sc.bg, sc.color)}>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <ItemDetailPanel item={item} canManage={canManage} />
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted">
              Page {safeCurrentPage} of {Math.ceil(tenant.inventoryBreakdown.total / perPage).toLocaleString()} — showing items {((safeCurrentPage - 1) * perPage) + 1}–{Math.min(safeCurrentPage * perPage, filtered.length)}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage(safeCurrentPage - 1)}
                className={cn("px-3 py-1.5 text-xs font-medium border border-border rounded-lg", safeCurrentPage <= 1 ? "text-muted opacity-50 cursor-not-allowed" : "text-foreground hover:bg-stone-50")}
              >
                Previous
              </button>
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg", safeCurrentPage === p ? "text-white bg-primary" : "text-foreground border border-border hover:bg-stone-50")}>
                  {p}
                </button>
              ))}
              {totalPages > 4 && <span className="px-2 text-xs text-muted">...</span>}
              {totalPages > 3 && (
                <button onClick={() => setCurrentPage(totalPages)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg", safeCurrentPage === totalPages ? "text-white bg-primary" : "text-foreground border border-border hover:bg-stone-50")}>
                  {Math.ceil(tenant.inventoryBreakdown.total / perPage).toLocaleString()}
                </button>
              )}
              <button
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage(safeCurrentPage + 1)}
                className={cn("px-3 py-1.5 text-xs font-medium border border-border rounded-lg", safeCurrentPage >= totalPages ? "text-muted opacity-50 cursor-not-allowed" : "text-foreground hover:bg-stone-50")}
              >
                Next
              </button>
            </div>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1.5 text-xs border border-border rounded-lg bg-white text-foreground"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={30}>30 per page</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}

// ---- Inline item detail (expands directly under the clicked row) ----

function ItemDetailPanel({ item, canManage }: { item: InventoryItem; canManage: boolean }) {
  const { showToast } = useToast();
  const anomaly = usageAnomalies[item.id];
  const custody = custodyLogs[item.id];
  const [showAnomaly, setShowAnomaly] = useState(false);
  return (
              <div className="p-5 bg-stone-50/70 border-t-2 border-primary/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
                    <p className="text-xs text-muted mt-0.5">SKU: {item.sku} | Lot: {item.lotNumber}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {anomaly && (
                      <button
                        onClick={() => setShowAnomaly((v) => !v)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors",
                          showAnomaly
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                        )}
                      >
                        <AlertTriangle className={cn("w-3.5 h-3.5", !showAnomaly && "pulse-dot")} />
                        Usage up {anomaly.change} — review
                      </button>
                    )}
                    {canManage && (
                      <ParAdjuster
                        itemName={item.name}
                        parLevel={item.parLevel}
                        onSave={(newPar) =>
                          showToast(`PAR level for ${item.name} updated to ${newPar.toLocaleString()} — replenishment targets recalculated`)
                        }
                      />
                    )}
                    <button
                      onClick={() => showToast(`Reorder request initiated for ${item.name} — PO draft created for ${item.supplier}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reorder
                    </button>
                    <button
                      onClick={() => showToast(`Transfer request for ${item.name} — select destination in ERP`, "info")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
                    </button>
                    <button
                      onClick={() => showToast(`Full transaction history for ${item.name} — requires ERP integration`, "info")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full History
                    </button>
                  </div>
                </div>
                {anomaly && showAnomaly && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-semibold text-red-800">
                            AI Anomaly: {anomaly.headline}
                          </h5>
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-200 text-red-800">
                            {anomaly.change} · {anomaly.window}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-xs">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Baseline</p>
                            <p className="text-foreground font-medium mt-0.5">{anomaly.baseline}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Current</p>
                            <p className="text-red-700 font-bold mt-0.5">{anomaly.current}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Clinical context</p>
                            <p className="text-foreground font-medium mt-0.5">{anomaly.context}</p>
                          </div>
                        </div>
                        <p className="text-xs text-red-800 leading-relaxed mt-3">{anomaly.assessment}</p>
                        <div className="mt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400 mb-1">Recommended actions</p>
                          <ul className="space-y-1">
                            {anomaly.recommendedActions.map((a) => (
                              <li key={a} className="text-xs text-foreground flex items-start gap-1.5">
                                <span className="text-red-400 mt-0.5">•</span>
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => showToast("Flagged for pharmacy supervisor review — investigation case opened", "warning")}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Flag for pharmacy review
                          </button>
                          <button
                            onClick={() => showToast("Cross-referencing Pyxis dispenses against MAR records…", "info")}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Cross-reference MAR
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  {[
                    { label: "Current Stock", value: item.currentStock.toLocaleString() },
                    { label: "PAR Level", value: item.parLevel.toLocaleString(), tooltip: "Periodic Automatic Replenishment — the target stock level to maintain" },
                    { label: "Reorder Point", value: item.reorderPoint.toLocaleString(), tooltip: "Stock level that triggers a new purchase order" },
                    { label: "Unit Cost", value: `$${item.unitCost.toFixed(2)}` },
                    { label: "Total Value", value: `$${(item.currentStock * item.unitCost).toLocaleString()}` },
                    { label: "Supplier", value: item.supplier },
                    { label: "Last Received", value: item.lastReceived },
                    { label: "Expiration", value: item.expirationDate || "N/A" },
                    { label: "Department", value: item.department },
                    { label: "Category", value: item.category },
                    { label: "Supply Chain", value: item.supplyChain === "med-surg" ? "Med/Surg" : item.supplyChain === "pharmacy" ? "Pharmacy" : item.supplyChain === "surgical" ? "Surgical" : "Laboratory" },
                    { label: "GPO Contract", value: item.gpoContract || "Off-Contract" },
                  ].map((d) => (
                    <div key={d.label}>
                      <p className="text-[11px] font-medium text-muted uppercase">
                        {"tooltip" in d && d.tooltip ? (
                          <Tooltip content={d.tooltip} position="bottom" wide>
                            <span className="cursor-help border-b border-dotted border-muted/60">{d.label}</span>
                          </Tooltip>
                        ) : d.label}
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>
                {item.category === "Controlled Substance" && (
                  <div className="mt-4 rounded-xl bg-white border border-red-200 overflow-hidden">
                    <div className="p-3 bg-red-50 border-b border-red-200">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-semibold text-red-700">Controlled Substance — Chain of Custody Active</span>
                      </div>
                      <p className="text-[11px] text-red-600 mt-1">
                        Full receipt/disposition tracking per MM 13.01.01. Last audit: Mar 13, 2026.
                        DSCSA serial verification: Verified.
                      </p>
                    </div>
                    {custody && (
                      <div className="p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-2">
                          Custody trail — every touch, witnessed
                        </p>
                        <div className="space-y-2">
                          {custody.map((e, i) => (
                            <div key={i} className="flex items-start gap-3 text-xs">
                              <span className="text-muted shrink-0 w-28 tabular-nums">{e.time}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-foreground">
                                  <span className="font-semibold">{e.action}</span>
                                  {" — "}{e.person}, {e.role}
                                  {e.witness && (
                                    <span className="text-muted"> · witness: {e.witness}</span>
                                  )}
                                </p>
                                <p className="text-[11px] text-muted mt-0.5">
                                  {e.location}
                                  {e.detail && <> · {e.detail}</>}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Location Breakdown — where is this item physically? */}
                {(() => {
                  const locations = itemLocations[item.id];
                  if (!locations) return null;
                  const storageIcons: Record<string, string> = {
                    shelf: "Shelf", pyxis: "Pyxis", cabinet: "Cabinet",
                    refrigerator: "Fridge", cage: "Secure Cage", cart: "Cart",
                  };
                  const centralLocs = locations.filter((l) => l.location.includes("Warehouse") || l.location.includes("Central") || l.location.includes("SPD"));
                  const floorLocs = locations.filter((l) => !l.location.includes("Warehouse") && !l.location.includes("Central") && !l.location.includes("SPD"));
                  const centralTotal = centralLocs.reduce((s, l) => s + l.qty, 0);
                  const floorTotal = floorLocs.reduce((s, l) => s + l.qty, 0);

                  const renderLocationRow = (loc: typeof locations[0], i: number) => {
                    const pct = item.currentStock > 0 ? (loc.qty / item.currentStock) * 100 : 0;
                    return (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{loc.location}</span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-100 text-muted">{loc.floor}</span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">{storageIcons[loc.storageType]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", loc.qty === 0 ? "bg-red-400" : pct > 30 ? "bg-primary" : "bg-amber-400")}
                              style={{ width: `${Math.max(pct, 2)}%` }}
                            />
                          </div>
                          <span className={cn(
                            "text-sm font-bold w-16 text-right",
                            loc.qty === 0 ? "text-red-600" : "text-foreground"
                          )}>
                            {loc.qty.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <h5 className="text-sm font-semibold text-foreground">Stock by Location</h5>
                          <span className="text-[11px] text-muted">({locations.length} locations)</span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px]">
                          <span className="text-muted">Central Inventory: <span className="font-bold text-foreground">{centralTotal.toLocaleString()}</span></span>
                          <span className="text-muted">Floor / Unit Level: <span className="font-bold text-foreground">{floorTotal.toLocaleString()}</span></span>
                        </div>
                      </div>

                      {centralLocs.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5 px-2">Central Inventory</p>
                          <div className="grid grid-cols-1 gap-1">
                            {centralLocs.map((loc, i) => renderLocationRow(loc, i))}
                          </div>
                        </div>
                      )}

                      {floorLocs.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5 px-2">Floor / Unit Level</p>
                          <div className="grid grid-cols-1 gap-1">
                            {floorLocs.map((loc, i) => renderLocationRow(loc, i + centralLocs.length))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
  );
}

// ---- PAR adjustment (Supply Chain Manager mock action) ----

function ParAdjuster({
  itemName,
  parLevel,
  onSave,
}: {
  itemName: string;
  parLevel: number;
  onSave: (newPar: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(parLevel);
  const step = Math.max(10, Math.round(parLevel * 0.05 / 10) * 10);

  if (!open) {
    return (
      <button
        onClick={() => {
          setValue(parLevel);
          setOpen(true);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5"
        title={`Adjust PAR level for ${itemName}`}
      >
        <ArrowUpDown className="w-3.5 h-3.5" /> Adjust PAR
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 border border-primary/30 rounded-lg bg-primary/5">
      <button
        onClick={() => setValue((v) => Math.max(step, v - step))}
        className="w-6 h-6 rounded text-primary font-bold hover:bg-primary/10"
      >
        −
      </button>
      <span className="text-xs font-bold text-foreground tabular-nums w-14 text-center">
        {value.toLocaleString()}
      </span>
      <button
        onClick={() => setValue((v) => v + step)}
        className="w-6 h-6 rounded text-primary font-bold hover:bg-primary/10"
      >
        +
      </button>
      <button
        onClick={() => {
          setOpen(false);
          onSave(value);
        }}
        className="ml-1 px-2 py-1 text-[11px] font-semibold rounded bg-primary text-white hover:bg-primary-dark"
      >
        Save
      </button>
      <button
        onClick={() => setOpen(false)}
        className="px-1.5 py-1 text-[11px] text-muted hover:text-foreground"
      >
        Cancel
      </button>
    </div>
  );
}
