"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { inventoryItems, departments, itemLocations, type InventoryItem } from "@/lib/mock-data";
import { MapPin } from "lucide-react";

const categoryFilters = ["All", "PPE", "Medication", "Supplies", "Surgical", "Controlled Substance", "Respiratory", "Testing", "Laboratory"];
const statusFilters = ["All", "in-stock", "low-stock", "critical", "out-of-stock", "expiring-soon"];
const departmentFilters = ["All", ...departments.map((d) => d.name)];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "in-stock": { label: "In Stock", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  "low-stock": { label: "Low Stock", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "critical": { label: "Critical", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  "out-of-stock": { label: "Out of Stock", color: "text-red-700", bg: "bg-red-100 border-red-300" },
  "expiring-soon": { label: "Expiring Soon", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
};

const deptIcons: Record<string, typeof Package> = {
  "Emergency Department": Siren,
  "Operating Rooms": Scissors,
  "Pharmacy": Pill,
  "Central Supply": Warehouse,
  "Intensive Care Unit": HeartPulse,
  "Med/Surg": Bed,
  "Labor & Delivery": Baby,
  "Laboratory": FlaskConical,
};

function StockBar({ current, par, reorder }: { current: number; par: number; reorder: number }) {
  const pct = Math.min((current / par) * 100, 100);
  const reorderPct = (reorder / par) * 100;
  const color = pct <= 25 ? "bg-red-500" : pct <= 60 ? "bg-amber-400" : "bg-emerald-500";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortField, setSortField] = useState<keyof InventoryItem>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...inventoryItems];

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
  }, [searchQuery, selectedCategory, selectedStatus, selectedDepartment, sortField, sortDir]);

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const summaryStats = useMemo(() => ({
    total: inventoryItems.length,
    inStock: inventoryItems.filter((i) => i.status === "in-stock").length,
    lowStock: inventoryItems.filter((i) => i.status === "low-stock").length,
    critical: inventoryItems.filter((i) => i.status === "critical" || i.status === "out-of-stock").length,
    expiring: inventoryItems.filter((i) => i.status === "expiring-soon").length,
    totalValue: inventoryItems.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0),
  }), []);

  return (
    <div className="min-h-screen">
      <Header title="Inventory Management" subtitle="Real-time stock tracking across all departments and locations" />

      <div className="p-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Items", value: summaryStats.total, icon: Package, color: "text-orange-700 bg-orange-50" },
            { label: "In Stock", value: summaryStats.inStock, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
            { label: "Low Stock", value: summaryStats.lowStock, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
            { label: "Critical / OOS", value: summaryStats.critical, icon: XCircle, color: "text-red-600 bg-red-50", tooltip: "Critical stock or completely Out of Stock" },
            { label: "Expiring Soon", value: summaryStats.expiring, icon: Clock, color: "text-orange-600 bg-orange-50" },
            { label: "Inventory Value", value: `$${(summaryStats.totalValue / 1000).toFixed(0)}K`, icon: FileBarChart, color: "text-rose-600 bg-rose-50" },
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
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Department Overview</h3>
          <div className="grid grid-cols-4 gap-3">
            {departments.map((dept) => {
              const DeptIcon = deptIcons[dept.name] || Package;
              const isSelected = selectedDepartment === dept.name;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(isSelected ? "All" : dept.name)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:bg-stone-50"
                  )}
                >
                  <DeptIcon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted")} />
                  <span className="text-[11px] font-medium text-foreground leading-tight">{dept.name}</span>
                  <span className="text-[11px] text-muted">{dept.itemCount.toLocaleString()} items</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search by name, SKU, lot number, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {categoryFilters.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : statusConfig[s]?.label || s}</option>
              ))}
            </select>

            <button
              onClick={() => showToast("Add Item requires ERP integration — use the AI assistant to draft a new item request", "info")}
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
            Showing {filtered.length} of {inventoryItems.length} items
            {selectedDepartment !== "All" && <span className="font-medium"> in {selectedDepartment}</span>}
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { field: "name" as const, label: "Item / SKU", width: "w-[260px]" },
                    { field: "category" as const, label: "Category", width: "w-[120px]" },
                    { field: "department" as const, label: "Department", width: "w-[140px]" },
                    { field: "currentStock" as const, label: "Stock Level", width: "w-[200px]" },
                    { field: "expirationDate" as const, label: "Expiration", width: "w-[100px]" },
                    { field: "supplier" as const, label: "Supplier", width: "w-[140px]" },
                    { field: "status" as const, label: "Status", width: "w-[120px]" },
                  ].map((col) => (
                    <th
                      key={col.field}
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
                {filtered.map((item) => {
                  const sc = statusConfig[item.status];
                  const isExpiringSoon = item.expirationDate && new Date(item.expirationDate) < new Date("2026-07-01");

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border/50 hover:bg-stone-50/50 transition-colors cursor-pointer"
                      onClick={() => setShowDetail(showDetail === item.id ? null : item.id)}
                    >
                      <td className="px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted font-mono">{item.sku}</p>
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
                        {item.expirationDate ? (
                          <span className={cn("text-xs", isExpiringSoon ? "text-orange-600 font-medium" : "text-foreground")}>
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {showDetail && (() => {
            const item = inventoryItems.find((i) => i.id === showDetail);
            if (!item) return null;
            return (
              <div className="mt-4 p-5 rounded-xl bg-stone-50 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
                    <p className="text-xs text-muted mt-0.5">SKU: {item.sku} | Lot: {item.lotNumber}</p>
                  </div>
                  <div className="flex gap-2">
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
                <div className="grid grid-cols-5 gap-4">
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
                  <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span className="text-xs font-semibold text-rose-700">Controlled Substance — Chain of Custody Active</span>
                    </div>
                    <p className="text-[11px] text-rose-600 mt-1">
                      Full receipt/disposition tracking per MM 13.01.01. Last audit: Mar 13, 2026.
                      DSCSA serial verification: Verified.
                    </p>
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
                  return (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <h5 className="text-sm font-semibold text-foreground">Where Is This Item?</h5>
                        <span className="text-[11px] text-muted">({locations.length} locations)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {locations.map((loc, i) => {
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
                                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-600">{storageIcons[loc.storageType]}</span>
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
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
