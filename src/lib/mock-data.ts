// ============================================================
// Mock Data for Health Canopy — UCSF Health
// ============================================================

export const organization = {
  name: "UCSF Medical Center",
  system: "UCSF Health",
  locations: [
    { id: "parnassus", name: "UCSF Medical Center at Parnassus Heights", city: "San Francisco, CA" },
    { id: "mission-bay", name: "UCSF Medical Center at Mission Bay", city: "San Francisco, CA" },
    { id: "mount-zion", name: "UCSF Medical Center at Mount Zion", city: "San Francisco, CA" },
    { id: "benioff-sf", name: "UCSF Benioff Children's Hospital SF", city: "San Francisco, CA" },
    { id: "benioff-oak", name: "UCSF Benioff Children's Hospital Oakland", city: "Oakland, CA" },
  ],
};

export const departments = [
  { id: "ed", name: "Emergency Department", icon: "Siren", itemCount: 3245, location: "parnassus" },
  { id: "or", name: "Operating Rooms", icon: "Scissors", itemCount: 4872, location: "parnassus" },
  { id: "pharmacy", name: "Pharmacy", icon: "Pill", itemCount: 6430, location: "parnassus" },
  { id: "central-supply", name: "Materials Management", icon: "Warehouse", itemCount: 11246, location: "parnassus" },
  { id: "icu", name: "Intensive Care Unit", icon: "HeartPulse", itemCount: 2912, location: "parnassus" },
  { id: "medsurg", name: "Med/Surg", icon: "Bed", itemCount: 2468, location: "parnassus" },
  { id: "ld", name: "Labor & Delivery", icon: "Baby", itemCount: 1974, location: "mission-bay" },
  { id: "lab", name: "Laboratory", icon: "FlaskConical", itemCount: 4218, location: "parnassus" },
  { id: "transplant", name: "Transplant Services", icon: "HeartPulse", itemCount: 1856, location: "parnassus" },
  { id: "oncology", name: "Oncology / Cancer Center", icon: "Activity", itemCount: 2134, location: "mission-bay" },
  { id: "neuro", name: "Neurosciences", icon: "Brain", itemCount: 1645, location: "parnassus" },
  { id: "cardiology", name: "Cardiology", icon: "HeartPulse", itemCount: 1523, location: "parnassus" },
];

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  department: string;
  sku: string;
  currentStock: number;
  parLevel: number;
  reorderPoint: number;
  unitCost: number;
  lotNumber: string;
  expirationDate: string | null;
  lastReceived: string;
  supplier: string;
  status: "in-stock" | "low-stock" | "critical" | "out-of-stock" | "expiring-soon";
  riskLevel?: "high" | "medium" | "low";
  supplyChain: "med-surg" | "pharmacy" | "surgical" | "lab";
  gpoContract?: string;
};

export const inventoryItems: InventoryItem[] = [
  { id: "INV-001", name: "Nitrile Examination Gloves (M)", category: "PPE", department: "Materials Management", sku: "PPE-GLV-NIT-M", currentStock: 24800, parLevel: 30000, reorderPoint: 16000, unitCost: 0.12, lotNumber: "LT-2026-0341", expirationDate: "2027-09-15", lastReceived: "2026-03-10", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-441" },
  { id: "INV-002", name: "N95 Respirator Masks", category: "PPE", department: "Materials Management", sku: "PPE-MSK-N95", currentStock: 6400, parLevel: 10000, reorderPoint: 5000, unitCost: 1.85, lotNumber: "LT-2026-0287", expirationDate: "2028-01-20", lastReceived: "2026-03-08", supplier: "3M Healthcare", status: "low-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-1187" },
  { id: "INV-003", name: "IV Catheter 20G", category: "Supplies", department: "Emergency Department", sku: "SUP-IVC-20G", currentStock: 900, parLevel: 1200, reorderPoint: 600, unitCost: 3.45, lotNumber: "LT-2026-0512", expirationDate: "2027-06-30", lastReceived: "2026-03-12", supplier: "BD Medical", status: "low-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-602" },
  { id: "INV-004", name: "Propofol 200mg/20mL", category: "Medication", department: "Pharmacy", sku: "RX-PRO-200", currentStock: 360, parLevel: 500, reorderPoint: 200, unitCost: 12.50, lotNumber: "LT-2026-0198", expirationDate: "2026-06-15", lastReceived: "2026-03-05", supplier: "Fresenius Kabi", status: "expiring-soon", supplyChain: "pharmacy", gpoContract: "Vizient #RX-2025-318" },
  { id: "INV-005", name: "Surgical Drape Kit — Total Knee", category: "Surgical", department: "Operating Rooms", sku: "SRG-DRP-TKR", currentStock: 170, parLevel: 200, reorderPoint: 80, unitCost: 34.00, lotNumber: "LT-2026-0445", expirationDate: null, lastReceived: "2026-03-11", supplier: "Cardinal Health", status: "in-stock", supplyChain: "surgical", gpoContract: "Vizient #SG-2025-773" },
  { id: "INV-006", name: "Heparin Sodium 5000U/mL", category: "Medication", department: "Pharmacy", sku: "RX-HEP-5000", currentStock: 90, parLevel: 400, reorderPoint: 160, unitCost: 8.75, lotNumber: "LT-2026-0089", expirationDate: "2026-11-30", lastReceived: "2026-02-28", supplier: "Pfizer", status: "critical", supplyChain: "pharmacy", gpoContract: "Vizient #RX-2025-105" },
  { id: "INV-007", name: "Endotracheal Tube 7.5mm", category: "Respiratory", department: "ICU", sku: "RSP-ETT-75", currentStock: 240, parLevel: 300, reorderPoint: 120, unitCost: 7.20, lotNumber: "LT-2026-0334", expirationDate: "2028-03-15", lastReceived: "2026-03-09", supplier: "Medtronic", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-008", name: "Foley Catheter 16Fr", category: "Supplies", department: "Med/Surg", sku: "SUP-FOL-16F", currentStock: 420, parLevel: 600, reorderPoint: 240, unitCost: 4.50, lotNumber: "LT-2026-0267", expirationDate: "2027-12-31", lastReceived: "2026-03-07", supplier: "Teleflex", status: "low-stock", supplyChain: "med-surg" },
  { id: "INV-009", name: "Fentanyl Citrate 100mcg/2mL", category: "Controlled Substance", department: "Pharmacy", sku: "RX-FEN-100", currentStock: 680, parLevel: 800, reorderPoint: 300, unitCost: 2.30, lotNumber: "LT-2026-0156", expirationDate: "2027-02-28", lastReceived: "2026-03-13", supplier: "Akorn", status: "in-stock", supplyChain: "pharmacy", gpoContract: "Vizient #CS-2025-042" },
  { id: "INV-010", name: "Sterile Surgical Gown (L)", category: "PPE", department: "Operating Rooms", sku: "PPE-GWN-STR-L", currentStock: 1080, parLevel: 1600, reorderPoint: 800, unitCost: 6.75, lotNumber: "LT-2026-0378", expirationDate: null, lastReceived: "2026-03-06", supplier: "Halyard Health", status: "low-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-441" },
  { id: "INV-011", name: "Blood Collection Tubes (EDTA)", category: "Laboratory", department: "Laboratory", sku: "LAB-BCT-EDTA", currentStock: 17000, parLevel: 20000, reorderPoint: 10000, unitCost: 0.35, lotNumber: "LT-2026-0401", expirationDate: "2027-08-15", lastReceived: "2026-03-11", supplier: "BD Vacutainer", status: "in-stock", supplyChain: "lab", gpoContract: "Vizient #LB-2025-209" },
  { id: "INV-012", name: "Oxytocin 10U/mL", category: "Medication", department: "Labor & Delivery", sku: "RX-OXY-10U", currentStock: 190, parLevel: 240, reorderPoint: 100, unitCost: 5.60, lotNumber: "LT-2026-0223", expirationDate: "2026-09-30", lastReceived: "2026-03-04", supplier: "Par Pharmaceutical", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-013", name: "Suture — Vicryl 3-0", category: "Surgical", department: "Operating Rooms", sku: "SRG-SUT-V30", currentStock: 30, parLevel: 400, reorderPoint: 160, unitCost: 9.80, lotNumber: "LT-2026-0489", expirationDate: "2028-06-30", lastReceived: "2026-02-20", supplier: "Ethicon (J&J)", status: "critical", supplyChain: "surgical", gpoContract: "Vizient #SG-2025-891" },
  { id: "INV-014", name: "Rapid COVID-19 Antigen Test", category: "Testing", department: "Emergency Department", sku: "TST-COV-RAP", currentStock: 4200, parLevel: 6000, reorderPoint: 2000, unitCost: 5.25, lotNumber: "LT-2026-0567", expirationDate: "2026-04-30", lastReceived: "2026-03-01", supplier: "Abbott Diagnostics", status: "expiring-soon", supplyChain: "lab" },
  { id: "INV-015", name: "Ventilator Circuit (Adult)", category: "Respiratory", department: "ICU", sku: "RSP-VCR-ADL", currentStock: 0, parLevel: 100, reorderPoint: 40, unitCost: 18.50, lotNumber: "LT-2026-0301", expirationDate: null, lastReceived: "2026-02-15", supplier: "Fisher & Paykel", status: "out-of-stock", supplyChain: "med-surg" },
  // --- PPE & Safety ---
  { id: "INV-016", name: "Nitrile Examination Gloves (L)", category: "PPE", department: "Materials Management", sku: "PPE-GLV-NIT-L", currentStock: 21200, parLevel: 28000, reorderPoint: 14000, unitCost: 0.12, lotNumber: "LT-2026-0342", expirationDate: "2027-09-15", lastReceived: "2026-03-10", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-441" },
  { id: "INV-017", name: "Nitrile Examination Gloves (S)", category: "PPE", department: "Materials Management", sku: "PPE-GLV-NIT-S", currentStock: 14600, parLevel: 18000, reorderPoint: 9000, unitCost: 0.12, lotNumber: "LT-2026-0343", expirationDate: "2027-09-15", lastReceived: "2026-03-10", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-441" },
  { id: "INV-018", name: "Surgical Mask — Level 3", category: "PPE", department: "Materials Management", sku: "PPE-MSK-L3", currentStock: 18500, parLevel: 20000, reorderPoint: 10000, unitCost: 0.18, lotNumber: "LT-2026-0355", expirationDate: "2028-06-30", lastReceived: "2026-03-12", supplier: "Halyard Health", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-441" },
  { id: "INV-019", name: "Face Shield — Anti-Fog", category: "PPE", department: "Emergency Department", sku: "PPE-FS-AF", currentStock: 3200, parLevel: 4000, reorderPoint: 2000, unitCost: 1.45, lotNumber: "LT-2026-0361", expirationDate: null, lastReceived: "2026-03-05", supplier: "Cardinal Health", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-020", name: "Sterile Surgical Gown (XL)", category: "PPE", department: "Operating Rooms", sku: "PPE-GWN-STR-XL", currentStock: 620, parLevel: 1000, reorderPoint: 500, unitCost: 7.25, lotNumber: "LT-2026-0379", expirationDate: null, lastReceived: "2026-03-06", supplier: "Halyard Health", status: "low-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-441" },
  { id: "INV-021", name: "Isolation Gown — Yellow", category: "PPE", department: "Materials Management", sku: "PPE-GWN-ISO-Y", currentStock: 8400, parLevel: 10000, reorderPoint: 5000, unitCost: 2.10, lotNumber: "LT-2026-0380", expirationDate: null, lastReceived: "2026-03-08", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-022", name: "Shoe Covers — Non-Skid", category: "PPE", department: "Operating Rooms", sku: "PPE-SHO-NS", currentStock: 5600, parLevel: 6000, reorderPoint: 3000, unitCost: 0.15, lotNumber: "LT-2026-0382", expirationDate: null, lastReceived: "2026-03-11", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-023", name: "Bouffant Cap — Blue", category: "PPE", department: "Operating Rooms", sku: "PPE-CAP-BF", currentStock: 7200, parLevel: 8000, reorderPoint: 4000, unitCost: 0.08, lotNumber: "LT-2026-0383", expirationDate: null, lastReceived: "2026-03-09", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg" },
  // --- IV / Vascular Access ---
  { id: "INV-024", name: "IV Catheter 18G", category: "Supplies", department: "Emergency Department", sku: "SUP-IVC-18G", currentStock: 1100, parLevel: 1400, reorderPoint: 700, unitCost: 3.65, lotNumber: "LT-2026-0513", expirationDate: "2027-06-30", lastReceived: "2026-03-12", supplier: "BD Medical", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-602" },
  { id: "INV-025", name: "IV Catheter 22G", category: "Supplies", department: "Emergency Department", sku: "SUP-IVC-22G", currentStock: 780, parLevel: 1000, reorderPoint: 500, unitCost: 3.25, lotNumber: "LT-2026-0514", expirationDate: "2027-06-30", lastReceived: "2026-03-12", supplier: "BD Medical", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-602" },
  { id: "INV-026", name: "Central Venous Catheter Kit (Triple Lumen)", category: "Supplies", department: "ICU", sku: "SUP-CVC-TL", currentStock: 85, parLevel: 120, reorderPoint: 50, unitCost: 45.00, lotNumber: "LT-2026-0520", expirationDate: "2027-12-15", lastReceived: "2026-03-04", supplier: "Teleflex", status: "in-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-710" },
  { id: "INV-027", name: "PICC Line Kit (4Fr Double Lumen)", category: "Supplies", department: "ICU", sku: "SUP-PICC-4FDL", currentStock: 42, parLevel: 60, reorderPoint: 25, unitCost: 68.00, lotNumber: "LT-2026-0521", expirationDate: "2027-09-30", lastReceived: "2026-03-06", supplier: "BD Medical", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-028", name: "IV Extension Set (Standard)", category: "Supplies", department: "Materials Management", sku: "SUP-IVE-STD", currentStock: 4200, parLevel: 5000, reorderPoint: 2500, unitCost: 1.20, lotNumber: "LT-2026-0525", expirationDate: "2028-03-31", lastReceived: "2026-03-10", supplier: "BD Medical", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-029", name: "Normal Saline 0.9% 1000mL", category: "Supplies", department: "Materials Management", sku: "SUP-NS-1000", currentStock: 1800, parLevel: 4000, reorderPoint: 2000, unitCost: 3.20, lotNumber: "LT-2026-0530", expirationDate: "2027-11-30", lastReceived: "2026-03-02", supplier: "Baxter International", status: "critical", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-201" },
  { id: "INV-030", name: "Lactated Ringer's 1000mL", category: "Supplies", department: "Materials Management", sku: "SUP-LR-1000", currentStock: 1200, parLevel: 2500, reorderPoint: 1200, unitCost: 3.80, lotNumber: "LT-2026-0531", expirationDate: "2027-10-15", lastReceived: "2026-03-02", supplier: "Baxter International", status: "low-stock", supplyChain: "med-surg", gpoContract: "Vizient #MS-2025-201" },
  { id: "INV-031", name: "D5W 1000mL", category: "Supplies", department: "Materials Management", sku: "SUP-D5W-1000", currentStock: 900, parLevel: 1500, reorderPoint: 750, unitCost: 3.50, lotNumber: "LT-2026-0532", expirationDate: "2027-09-30", lastReceived: "2026-03-03", supplier: "Baxter International", status: "low-stock", supplyChain: "med-surg" },
  // --- Medications (Pharmacy) ---
  { id: "INV-032", name: "Morphine Sulfate 4mg/mL", category: "Controlled Substance", department: "Pharmacy", sku: "RX-MOR-4", currentStock: 520, parLevel: 600, reorderPoint: 250, unitCost: 1.85, lotNumber: "LT-2026-0160", expirationDate: "2027-04-30", lastReceived: "2026-03-11", supplier: "West-Ward Pharmaceuticals", status: "in-stock", supplyChain: "pharmacy", gpoContract: "Vizient #CS-2025-043" },
  { id: "INV-033", name: "Midazolam 5mg/mL", category: "Controlled Substance", department: "Pharmacy", sku: "RX-MDZ-5", currentStock: 380, parLevel: 450, reorderPoint: 180, unitCost: 3.40, lotNumber: "LT-2026-0161", expirationDate: "2027-06-15", lastReceived: "2026-03-09", supplier: "Akorn", status: "in-stock", supplyChain: "pharmacy", gpoContract: "Vizient #CS-2025-044" },
  { id: "INV-034", name: "Vancomycin 1g IV", category: "Medication", department: "Pharmacy", sku: "RX-VAN-1G", currentStock: 450, parLevel: 600, reorderPoint: 250, unitCost: 8.20, lotNumber: "LT-2026-0170", expirationDate: "2027-08-31", lastReceived: "2026-03-07", supplier: "Pfizer", status: "in-stock", supplyChain: "pharmacy", gpoContract: "Vizient #RX-2025-112" },
  { id: "INV-035", name: "Ceftriaxone 1g IV", category: "Medication", department: "Pharmacy", sku: "RX-CEF-1G", currentStock: 380, parLevel: 500, reorderPoint: 200, unitCost: 4.50, lotNumber: "LT-2026-0171", expirationDate: "2027-07-31", lastReceived: "2026-03-08", supplier: "Fresenius Kabi", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-036", name: "Metoprolol Tartrate 5mg/5mL IV", category: "Medication", department: "Pharmacy", sku: "RX-MET-5IV", currentStock: 290, parLevel: 350, reorderPoint: 140, unitCost: 6.80, lotNumber: "LT-2026-0175", expirationDate: "2027-05-15", lastReceived: "2026-03-05", supplier: "Hikma Pharmaceuticals", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-037", name: "Epinephrine 1mg/mL (1:1000)", category: "Medication", department: "Emergency Department", sku: "RX-EPI-1MG", currentStock: 240, parLevel: 300, reorderPoint: 120, unitCost: 28.50, lotNumber: "LT-2026-0180", expirationDate: "2026-08-30", lastReceived: "2026-03-01", supplier: "Par Pharmaceutical", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-038", name: "Norepinephrine 4mg/4mL", category: "Medication", department: "ICU", sku: "RX-NOR-4", currentStock: 180, parLevel: 250, reorderPoint: 100, unitCost: 22.00, lotNumber: "LT-2026-0181", expirationDate: "2027-01-15", lastReceived: "2026-03-04", supplier: "Pfizer", status: "in-stock", supplyChain: "pharmacy", gpoContract: "Vizient #RX-2025-115" },
  { id: "INV-039", name: "Insulin Glargine 100U/mL (Lantus)", category: "Medication", department: "Pharmacy", sku: "RX-INS-GLR", currentStock: 120, parLevel: 200, reorderPoint: 80, unitCost: 42.00, lotNumber: "LT-2026-0185", expirationDate: "2026-07-31", lastReceived: "2026-02-28", supplier: "Sanofi", status: "low-stock", supplyChain: "pharmacy" },
  { id: "INV-040", name: "Ondansetron 4mg/2mL (Zofran)", category: "Medication", department: "Pharmacy", sku: "RX-OND-4", currentStock: 850, parLevel: 1000, reorderPoint: 400, unitCost: 1.90, lotNumber: "LT-2026-0186", expirationDate: "2027-10-31", lastReceived: "2026-03-12", supplier: "Hikma Pharmaceuticals", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-041", name: "Ketorolac 30mg/mL (Toradol)", category: "Medication", department: "Emergency Department", sku: "RX-KET-30", currentStock: 410, parLevel: 500, reorderPoint: 200, unitCost: 3.20, lotNumber: "LT-2026-0187", expirationDate: "2027-09-30", lastReceived: "2026-03-10", supplier: "Hikma Pharmaceuticals", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-042", name: "Lorazepam 2mg/mL (Ativan)", category: "Controlled Substance", department: "Pharmacy", sku: "RX-LOR-2", currentStock: 260, parLevel: 320, reorderPoint: 130, unitCost: 4.10, lotNumber: "LT-2026-0162", expirationDate: "2027-03-15", lastReceived: "2026-03-07", supplier: "Akorn", status: "in-stock", supplyChain: "pharmacy", gpoContract: "Vizient #CS-2025-045" },
  { id: "INV-043", name: "Tacrolimus 5mg Capsule", category: "Medication", department: "Transplant Services", sku: "RX-TAC-5", currentStock: 340, parLevel: 400, reorderPoint: 160, unitCost: 18.50, lotNumber: "LT-2026-0190", expirationDate: "2027-04-30", lastReceived: "2026-03-06", supplier: "Astellas Pharma", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-044", name: "Mycophenolate Mofetil 500mg", category: "Medication", department: "Transplant Services", sku: "RX-MYC-500", currentStock: 280, parLevel: 350, reorderPoint: 140, unitCost: 8.90, lotNumber: "LT-2026-0191", expirationDate: "2027-06-30", lastReceived: "2026-03-05", supplier: "Genentech", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-045", name: "Cisplatin 50mg/50mL", category: "Medication", department: "Oncology / Cancer Center", sku: "RX-CIS-50", currentStock: 65, parLevel: 100, reorderPoint: 40, unitCost: 32.00, lotNumber: "LT-2026-0195", expirationDate: "2026-09-15", lastReceived: "2026-03-03", supplier: "Fresenius Kabi", status: "low-stock", supplyChain: "pharmacy" },
  { id: "INV-046", name: "Pembrolizumab 100mg/4mL (Keytruda)", category: "Medication", department: "Oncology / Cancer Center", sku: "RX-PEM-100", currentStock: 24, parLevel: 40, reorderPoint: 15, unitCost: 4850.00, lotNumber: "LT-2026-0196", expirationDate: "2026-08-31", lastReceived: "2026-03-01", supplier: "Merck", status: "low-stock", supplyChain: "pharmacy" },
  { id: "INV-047", name: "Alteplase 100mg (tPA)", category: "Medication", department: "Emergency Department", sku: "RX-TPA-100", currentStock: 18, parLevel: 25, reorderPoint: 10, unitCost: 6200.00, lotNumber: "LT-2026-0200", expirationDate: "2026-10-15", lastReceived: "2026-02-25", supplier: "Genentech", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-048", name: "Levetiracetam 500mg/5mL IV (Keppra)", category: "Medication", department: "Neurosciences", sku: "RX-LEV-500", currentStock: 320, parLevel: 400, reorderPoint: 160, unitCost: 5.40, lotNumber: "LT-2026-0205", expirationDate: "2027-08-31", lastReceived: "2026-03-08", supplier: "UCB Pharma", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-049", name: "Amiodarone 150mg/3mL IV", category: "Medication", department: "Cardiology", sku: "RX-AMI-150", currentStock: 190, parLevel: 250, reorderPoint: 100, unitCost: 7.60, lotNumber: "LT-2026-0210", expirationDate: "2027-05-15", lastReceived: "2026-03-06", supplier: "Pfizer", status: "in-stock", supplyChain: "pharmacy" },
  { id: "INV-050", name: "Nitroglycerin 50mg/250mL Drip", category: "Medication", department: "Cardiology", sku: "RX-NTG-50", currentStock: 140, parLevel: 200, reorderPoint: 80, unitCost: 14.50, lotNumber: "LT-2026-0211", expirationDate: "2027-02-28", lastReceived: "2026-03-04", supplier: "Baxter International", status: "in-stock", supplyChain: "pharmacy" },
  // --- Surgical Supplies ---
  { id: "INV-051", name: "Suture — Monocryl 3-0", category: "Surgical", department: "Operating Rooms", sku: "SRG-SUT-M30", currentStock: 280, parLevel: 350, reorderPoint: 140, unitCost: 11.50, lotNumber: "LT-2026-0490", expirationDate: "2028-06-30", lastReceived: "2026-03-09", supplier: "Ethicon (J&J)", status: "in-stock", supplyChain: "surgical", gpoContract: "Vizient #SG-2025-891" },
  { id: "INV-052", name: "Suture — Prolene 4-0", category: "Surgical", department: "Operating Rooms", sku: "SRG-SUT-P40", currentStock: 190, parLevel: 250, reorderPoint: 100, unitCost: 12.80, lotNumber: "LT-2026-0491", expirationDate: "2028-06-30", lastReceived: "2026-03-09", supplier: "Ethicon (J&J)", status: "in-stock", supplyChain: "surgical", gpoContract: "Vizient #SG-2025-891" },
  { id: "INV-053", name: "Suture — Silk 2-0", category: "Surgical", department: "Operating Rooms", sku: "SRG-SUT-S20", currentStock: 150, parLevel: 200, reorderPoint: 80, unitCost: 7.40, lotNumber: "LT-2026-0492", expirationDate: "2028-12-31", lastReceived: "2026-03-07", supplier: "Ethicon (J&J)", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-054", name: "Surgical Drape Kit — Hip", category: "Surgical", department: "Operating Rooms", sku: "SRG-DRP-HIP", currentStock: 110, parLevel: 150, reorderPoint: 60, unitCost: 38.00, lotNumber: "LT-2026-0446", expirationDate: null, lastReceived: "2026-03-11", supplier: "Cardinal Health", status: "in-stock", supplyChain: "surgical", gpoContract: "Vizient #SG-2025-773" },
  { id: "INV-055", name: "Laparoscopic Trocar Kit", category: "Surgical", department: "Operating Rooms", sku: "SRG-LAP-TRO", currentStock: 95, parLevel: 120, reorderPoint: 50, unitCost: 28.00, lotNumber: "LT-2026-0450", expirationDate: null, lastReceived: "2026-03-08", supplier: "Medtronic", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-056", name: "Bone Cement 40g", category: "Surgical", department: "Operating Rooms", sku: "SRG-BC-40G", currentStock: 48, parLevel: 80, reorderPoint: 30, unitCost: 45.00, lotNumber: "LT-2026-0455", expirationDate: "2028-01-31", lastReceived: "2026-03-05", supplier: "Stryker", status: "low-stock", supplyChain: "surgical" },
  { id: "INV-057", name: "Hemovac Drain 400mL", category: "Surgical", department: "Operating Rooms", sku: "SRG-HEM-400", currentStock: 180, parLevel: 200, reorderPoint: 80, unitCost: 22.00, lotNumber: "LT-2026-0460", expirationDate: null, lastReceived: "2026-03-10", supplier: "Zimmer Biomet", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-058", name: "Cautery Pencil — Disposable", category: "Surgical", department: "Operating Rooms", sku: "SRG-CAU-DIS", currentStock: 320, parLevel: 400, reorderPoint: 160, unitCost: 4.80, lotNumber: "LT-2026-0465", expirationDate: null, lastReceived: "2026-03-11", supplier: "Medtronic", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-059", name: "Spinal Drape Kit", category: "Surgical", department: "Operating Rooms", sku: "SRG-DRP-SPN", currentStock: 55, parLevel: 80, reorderPoint: 30, unitCost: 42.00, lotNumber: "LT-2026-0447", expirationDate: null, lastReceived: "2026-03-06", supplier: "Cardinal Health", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-060", name: "Bone Graft Substitute 10cc", category: "Surgical", department: "Operating Rooms", sku: "SRG-BGS-10", currentStock: 22, parLevel: 40, reorderPoint: 15, unitCost: 320.00, lotNumber: "LT-2026-0470", expirationDate: "2027-12-31", lastReceived: "2026-02-28", supplier: "Medtronic", status: "low-stock", supplyChain: "surgical" },
  // --- Respiratory / ICU ---
  { id: "INV-061", name: "Endotracheal Tube 7.0mm", category: "Respiratory", department: "ICU", sku: "RSP-ETT-70", currentStock: 200, parLevel: 250, reorderPoint: 100, unitCost: 7.20, lotNumber: "LT-2026-0335", expirationDate: "2028-03-15", lastReceived: "2026-03-09", supplier: "Medtronic", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-062", name: "Endotracheal Tube 8.0mm", category: "Respiratory", department: "ICU", sku: "RSP-ETT-80", currentStock: 180, parLevel: 250, reorderPoint: 100, unitCost: 7.20, lotNumber: "LT-2026-0336", expirationDate: "2028-03-15", lastReceived: "2026-03-09", supplier: "Medtronic", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-063", name: "Oxygen Nasal Cannula (Adult)", category: "Respiratory", department: "Materials Management", sku: "RSP-ONC-ADL", currentStock: 3500, parLevel: 4000, reorderPoint: 2000, unitCost: 0.85, lotNumber: "LT-2026-0340", expirationDate: null, lastReceived: "2026-03-10", supplier: "Teleflex", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-064", name: "High-Flow Nasal Cannula Kit", category: "Respiratory", department: "ICU", sku: "RSP-HFC-KIT", currentStock: 65, parLevel: 100, reorderPoint: 40, unitCost: 32.00, lotNumber: "LT-2026-0345", expirationDate: null, lastReceived: "2026-03-07", supplier: "Fisher & Paykel", status: "low-stock", supplyChain: "med-surg" },
  { id: "INV-065", name: "Suction Catheter 14Fr", category: "Respiratory", department: "ICU", sku: "RSP-SUC-14F", currentStock: 480, parLevel: 600, reorderPoint: 250, unitCost: 2.40, lotNumber: "LT-2026-0350", expirationDate: "2028-06-30", lastReceived: "2026-03-08", supplier: "Cardinal Health", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-066", name: "Humidifier Chamber (MR850)", category: "Respiratory", department: "ICU", sku: "RSP-HUM-MR850", currentStock: 40, parLevel: 60, reorderPoint: 25, unitCost: 12.00, lotNumber: "LT-2026-0352", expirationDate: null, lastReceived: "2026-03-05", supplier: "Fisher & Paykel", status: "low-stock", supplyChain: "med-surg" },
  // --- Laboratory ---
  { id: "INV-067", name: "Blood Collection Tubes (Heparin — Green)", category: "Laboratory", department: "Laboratory", sku: "LAB-BCT-HEP", currentStock: 12000, parLevel: 15000, reorderPoint: 7500, unitCost: 0.38, lotNumber: "LT-2026-0402", expirationDate: "2027-08-15", lastReceived: "2026-03-11", supplier: "BD Vacutainer", status: "in-stock", supplyChain: "lab", gpoContract: "Vizient #LB-2025-209" },
  { id: "INV-068", name: "Blood Collection Tubes (Citrate — Blue)", category: "Laboratory", department: "Laboratory", sku: "LAB-BCT-CIT", currentStock: 9500, parLevel: 12000, reorderPoint: 6000, unitCost: 0.40, lotNumber: "LT-2026-0403", expirationDate: "2027-08-15", lastReceived: "2026-03-11", supplier: "BD Vacutainer", status: "in-stock", supplyChain: "lab", gpoContract: "Vizient #LB-2025-209" },
  { id: "INV-069", name: "Blood Collection Tubes (SST — Gold)", category: "Laboratory", department: "Laboratory", sku: "LAB-BCT-SST", currentStock: 11000, parLevel: 14000, reorderPoint: 7000, unitCost: 0.42, lotNumber: "LT-2026-0404", expirationDate: "2027-08-15", lastReceived: "2026-03-11", supplier: "BD Vacutainer", status: "in-stock", supplyChain: "lab", gpoContract: "Vizient #LB-2025-209" },
  { id: "INV-070", name: "Urinalysis Test Strips (10SG)", category: "Laboratory", department: "Laboratory", sku: "LAB-UAS-10SG", currentStock: 6800, parLevel: 8000, reorderPoint: 4000, unitCost: 0.22, lotNumber: "LT-2026-0410", expirationDate: "2027-03-31", lastReceived: "2026-03-09", supplier: "Siemens Healthineers", status: "in-stock", supplyChain: "lab" },
  { id: "INV-071", name: "Rapid Strep Test Kit", category: "Testing", department: "Emergency Department", sku: "TST-STRP-RAP", currentStock: 2400, parLevel: 3000, reorderPoint: 1500, unitCost: 3.80, lotNumber: "LT-2026-0570", expirationDate: "2027-01-31", lastReceived: "2026-03-05", supplier: "Abbott Diagnostics", status: "in-stock", supplyChain: "lab" },
  { id: "INV-072", name: "Troponin I Test Cartridge", category: "Testing", department: "Emergency Department", sku: "TST-TROP-I", currentStock: 1800, parLevel: 2500, reorderPoint: 1000, unitCost: 8.50, lotNumber: "LT-2026-0575", expirationDate: "2026-12-31", lastReceived: "2026-03-07", supplier: "Abbott Diagnostics", status: "in-stock", supplyChain: "lab" },
  { id: "INV-073", name: "Blood Gas Syringe Kit", category: "Laboratory", department: "Laboratory", sku: "LAB-BGS-KIT", currentStock: 2200, parLevel: 3000, reorderPoint: 1500, unitCost: 2.80, lotNumber: "LT-2026-0415", expirationDate: "2027-06-30", lastReceived: "2026-03-08", supplier: "Radiometer", status: "in-stock", supplyChain: "lab" },
  // --- General Med/Surg Supplies ---
  { id: "INV-074", name: "Foley Catheter 18Fr", category: "Supplies", department: "Med/Surg", sku: "SUP-FOL-18F", currentStock: 350, parLevel: 500, reorderPoint: 200, unitCost: 4.75, lotNumber: "LT-2026-0268", expirationDate: "2027-12-31", lastReceived: "2026-03-07", supplier: "Teleflex", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-075", name: "Nasogastric Tube 16Fr (Salem Sump)", category: "Supplies", department: "Med/Surg", sku: "SUP-NGT-16F", currentStock: 280, parLevel: 350, reorderPoint: 140, unitCost: 5.20, lotNumber: "LT-2026-0270", expirationDate: "2028-03-31", lastReceived: "2026-03-06", supplier: "Cardinal Health", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-076", name: "Wound Vac Dressing Kit (Medium)", category: "Supplies", department: "Med/Surg", sku: "SUP-WVC-MED", currentStock: 75, parLevel: 100, reorderPoint: 40, unitCost: 85.00, lotNumber: "LT-2026-0275", expirationDate: null, lastReceived: "2026-03-04", supplier: "3M/KCI", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-077", name: "Tegaderm Transparent Dressing (10x12cm)", category: "Supplies", department: "Materials Management", sku: "SUP-TGD-10X12", currentStock: 4800, parLevel: 6000, reorderPoint: 3000, unitCost: 1.35, lotNumber: "LT-2026-0280", expirationDate: "2028-06-30", lastReceived: "2026-03-10", supplier: "3M Healthcare", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-078", name: "Sterile Gauze Pads 4x4 (12-ply)", category: "Supplies", department: "Materials Management", sku: "SUP-GAU-4X4", currentStock: 15000, parLevel: 18000, reorderPoint: 9000, unitCost: 0.08, lotNumber: "LT-2026-0285", expirationDate: null, lastReceived: "2026-03-11", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-079", name: "Alcohol Prep Pads", category: "Supplies", department: "Materials Management", sku: "SUP-ALC-PAD", currentStock: 28000, parLevel: 35000, reorderPoint: 18000, unitCost: 0.02, lotNumber: "LT-2026-0290", expirationDate: "2028-12-31", lastReceived: "2026-03-12", supplier: "Medline Industries", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-080", name: "Pressure Injury Prevention Mattress Overlay", category: "Supplies", department: "Med/Surg", sku: "SUP-PIP-MAT", currentStock: 30, parLevel: 50, reorderPoint: 20, unitCost: 145.00, lotNumber: "LT-2026-0295", expirationDate: null, lastReceived: "2026-02-20", supplier: "Stryker", status: "low-stock", supplyChain: "med-surg" },
  { id: "INV-081", name: "Sequential Compression Device Sleeves (L)", category: "Supplies", department: "Med/Surg", sku: "SUP-SCD-L", currentStock: 420, parLevel: 500, reorderPoint: 200, unitCost: 8.50, lotNumber: "LT-2026-0298", expirationDate: null, lastReceived: "2026-03-09", supplier: "Cardinal Health", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-082", name: "Chest Tube Drainage Kit (28Fr)", category: "Supplies", department: "Emergency Department", sku: "SUP-CTD-28F", currentStock: 45, parLevel: 60, reorderPoint: 25, unitCost: 42.00, lotNumber: "LT-2026-0300", expirationDate: null, lastReceived: "2026-03-04", supplier: "Teleflex", status: "in-stock", supplyChain: "med-surg" },
  // --- L&D / OB Specific ---
  { id: "INV-083", name: "Fetal Scalp Electrode", category: "Supplies", department: "Labor & Delivery", sku: "SUP-FSE-01", currentStock: 140, parLevel: 180, reorderPoint: 70, unitCost: 12.50, lotNumber: "LT-2026-0225", expirationDate: "2027-11-30", lastReceived: "2026-03-07", supplier: "GE Healthcare", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-084", name: "Amniotomy Hook (Disposable)", category: "Supplies", department: "Labor & Delivery", sku: "SUP-AMH-DIS", currentStock: 200, parLevel: 250, reorderPoint: 100, unitCost: 3.80, lotNumber: "LT-2026-0226", expirationDate: "2028-03-31", lastReceived: "2026-03-06", supplier: "Utah Medical Products", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-085", name: "C-Section Drape Kit", category: "Surgical", department: "Labor & Delivery", sku: "SRG-DRP-CS", currentStock: 90, parLevel: 120, reorderPoint: 50, unitCost: 32.00, lotNumber: "LT-2026-0448", expirationDate: null, lastReceived: "2026-03-08", supplier: "Cardinal Health", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-086", name: "Infant Warmer Liner", category: "Supplies", department: "Labor & Delivery", sku: "SUP-IWL-01", currentStock: 350, parLevel: 400, reorderPoint: 160, unitCost: 8.50, lotNumber: "LT-2026-0230", expirationDate: null, lastReceived: "2026-03-05", supplier: "GE Healthcare", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-087", name: "Magnesium Sulfate 4g/100mL IV", category: "Medication", department: "Labor & Delivery", sku: "RX-MGS-4G", currentStock: 80, parLevel: 120, reorderPoint: 50, unitCost: 9.80, lotNumber: "LT-2026-0228", expirationDate: "2027-04-30", lastReceived: "2026-03-03", supplier: "Fresenius Kabi", status: "low-stock", supplyChain: "pharmacy" },
  // --- Neuro / Cardiology Specific ---
  { id: "INV-088", name: "EEG Electrode (Gold Cup)", category: "Supplies", department: "Neurosciences", sku: "SUP-EEG-GC", currentStock: 600, parLevel: 800, reorderPoint: 350, unitCost: 4.20, lotNumber: "LT-2026-0310", expirationDate: null, lastReceived: "2026-03-07", supplier: "Natus Medical", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-089", name: "Intracranial Pressure Monitor Kit", category: "Supplies", department: "Neurosciences", sku: "SUP-ICP-KIT", currentStock: 15, parLevel: 25, reorderPoint: 10, unitCost: 680.00, lotNumber: "LT-2026-0312", expirationDate: "2027-09-30", lastReceived: "2026-02-25", supplier: "Integra LifeSciences", status: "low-stock", supplyChain: "med-surg" },
  { id: "INV-090", name: "Cardiac Catheterization Kit", category: "Supplies", department: "Cardiology", sku: "SUP-CCK-01", currentStock: 35, parLevel: 50, reorderPoint: 20, unitCost: 285.00, lotNumber: "LT-2026-0315", expirationDate: "2027-06-30", lastReceived: "2026-03-04", supplier: "Boston Scientific", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-091", name: "Drug-Eluting Stent (3.0x18mm)", category: "Supplies", department: "Cardiology", sku: "SUP-DES-3018", currentStock: 28, parLevel: 40, reorderPoint: 15, unitCost: 1250.00, lotNumber: "LT-2026-0316", expirationDate: "2027-08-31", lastReceived: "2026-03-01", supplier: "Abbott Vascular", status: "in-stock", supplyChain: "med-surg" },
  { id: "INV-092", name: "ECG Electrode Pads (50-pack)", category: "Supplies", department: "Cardiology", sku: "SUP-ECG-PAD", currentStock: 2400, parLevel: 3000, reorderPoint: 1500, unitCost: 0.45, lotNumber: "LT-2026-0318", expirationDate: "2027-12-31", lastReceived: "2026-03-10", supplier: "3M Healthcare", status: "in-stock", supplyChain: "med-surg" },
  // --- Additional high-value / specialty items ---
  { id: "INV-093", name: "Surgical Stapler (Endo GIA 60mm)", category: "Surgical", department: "Operating Rooms", sku: "SRG-STP-EG60", currentStock: 60, parLevel: 80, reorderPoint: 30, unitCost: 185.00, lotNumber: "LT-2026-0475", expirationDate: null, lastReceived: "2026-03-05", supplier: "Medtronic", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-094", name: "Surgical Stapler Reload (Endo GIA 60mm)", category: "Surgical", department: "Operating Rooms", sku: "SRG-STP-RL60", currentStock: 140, parLevel: 180, reorderPoint: 70, unitCost: 95.00, lotNumber: "LT-2026-0476", expirationDate: null, lastReceived: "2026-03-05", supplier: "Medtronic", status: "in-stock", supplyChain: "surgical" },
  { id: "INV-095", name: "Cell Saver Tubing Set", category: "Surgical", department: "Operating Rooms", sku: "SRG-CST-01", currentStock: 25, parLevel: 40, reorderPoint: 15, unitCost: 85.00, lotNumber: "LT-2026-0480", expirationDate: null, lastReceived: "2026-03-03", supplier: "Haemonetics", status: "low-stock", supplyChain: "surgical" },
];

// Location-level stock breakdown — where exactly each item is stored
// Maps item ID → list of physical locations with quantities
export type StockLocation = {
  location: string;  // Physical location name
  floor: string;     // Floor/building
  qty: number;
  storageType: "shelf" | "pyxis" | "cabinet" | "refrigerator" | "cage" | "cart";
  parLevelLocal?: number;
  lastReplenished?: string;
};

export const itemLocations: Record<string, StockLocation[]> = {
  "INV-001": [ // Nitrile Gloves
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 12000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 2400, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 1600, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 2800, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 1200, storageType: "shelf" },
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 800, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 2000, storageType: "shelf" },
    { location: "Benioff Oakland Supply", floor: "Oakland Main 3rd Floor", qty: 2000, storageType: "shelf" },
  ],
  "INV-002": [ // N95 Masks
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 3000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 1000, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 600, storageType: "shelf" },
    { location: "Respiratory Therapy — Parnassus", floor: "Moffitt 8th Floor", qty: 400, storageType: "cabinet" },
    { location: "Isolation Cart — Long 11th", floor: "Long 11th Floor", qty: 400, storageType: "cart" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 600, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 400, storageType: "shelf" },
  ],
  "INV-003": [ // IV Catheter 20G
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 400, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 200, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 160, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 140, storageType: "shelf" },
  ],
  "INV-004": [ // Propofol
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 240, storageType: "refrigerator" },
    { location: "OR Anesthesia Workroom", floor: "Long 3rd Floor", qty: 80, storageType: "refrigerator" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 30, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 10, storageType: "pyxis" },
  ],
  "INV-005": [ // Surgical Drape Kit — Total Knee
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 110, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 40, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 20, storageType: "shelf" },
  ],
  "INV-006": [ // Heparin
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 50, storageType: "shelf" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 16, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 14, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 10, storageType: "pyxis" },
  ],
  "INV-007": [ // Endotracheal Tube 7.5mm
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 100, storageType: "cabinet" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 60, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 50, storageType: "shelf" },
    { location: "OR Anesthesia Workroom", floor: "Long 3rd Floor", qty: 30, storageType: "cabinet" },
  ],
  "INV-008": [ // Foley Catheter 16Fr
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 160, storageType: "shelf" },
    { location: "Parnassus Med/Surg 11 Long", floor: "Long 11th Floor", qty: 100, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 80, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 50, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 30, storageType: "shelf" },
  ],
  "INV-009": [ // Fentanyl (Controlled Substance)
    { location: "Pharmacy — Controlled Substance Vault", floor: "Moffitt 1st Floor", qty: 400, storageType: "cage" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 120, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 80, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 50, storageType: "pyxis" },
    { location: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", qty: 30, storageType: "pyxis" },
  ],
  "INV-010": [ // Sterile Surgical Gown (L)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 500, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 300, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 160, storageType: "shelf" },
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 80, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 40, storageType: "shelf" },
  ],
  "INV-011": [ // Blood Collection Tubes (EDTA)
    { location: "Lab Supply Room — Parnassus", floor: "Moffitt 1st Floor", qty: 8000, storageType: "shelf" },
    { location: "Lab — Blood Bank", floor: "Moffitt 1st Floor", qty: 4000, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 3000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 1200, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 800, storageType: "shelf" },
  ],
  "INV-012": [ // Oxytocin
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 80, storageType: "refrigerator" },
    { location: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", qty: 60, storageType: "pyxis" },
    { location: "Mission Bay L&D Medication Room", floor: "Mission Bay 4th Floor", qty: 50, storageType: "refrigerator" },
  ],
  "INV-013": [ // Vicryl Sutures
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 20, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10, storageType: "shelf" },
  ],
  "INV-014": [ // COVID Tests
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 1600, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 1500, storageType: "shelf" },
    { location: "Lab — Testing Area", floor: "Moffitt 1st Floor", qty: 600, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 500, storageType: "shelf" },
  ],
  "INV-015": [ // Ventilator Circuits (OUT OF STOCK)
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 0, storageType: "shelf" },
    { location: "Respiratory Therapy — Parnassus", floor: "Moffitt 8th Floor", qty: 0, storageType: "shelf" },
  ],
  "INV-018": [ // Surgical Mask — Level 3
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 8000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 2500, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 1800, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 2200, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 2000, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 2000, storageType: "shelf" },
  ],
  "INV-019": [ // Face Shield — Anti-Fog
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 1200, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 800, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 500, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 700, storageType: "shelf" },
  ],
  "INV-020": [ // Sterile Surgical Gown (XL)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 300, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 180, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 100, storageType: "shelf" },
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 40, storageType: "shelf" },
  ],
  "INV-021": [ // Isolation Gown — Yellow
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 3500, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 1200, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 800, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 900, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 1000, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 1000, storageType: "shelf" },
  ],
  "INV-024": [ // IV Catheter 18G
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 450, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 250, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 180, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 220, storageType: "shelf" },
  ],
  "INV-026": [ // Central Venous Catheter Kit (Triple Lumen)
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 30, storageType: "cabinet" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 20, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 25, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 10, storageType: "cabinet" },
  ],
  "INV-028": [ // IV Extension Set (Standard)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 1800, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 600, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 500, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 400, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 500, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 400, storageType: "shelf" },
  ],
  "INV-029": [ // Normal Saline 0.9% 1000mL (CRITICAL)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 600, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 300, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 250, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 200, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 250, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 200, storageType: "shelf" },
  ],
  "INV-030": [ // Lactated Ringer's 1000mL (LOW STOCK)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 400, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 250, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 200, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 200, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 150, storageType: "shelf" },
  ],
  "INV-032": [ // Morphine Sulfate 4mg/mL (Controlled Substance)
    { location: "Pharmacy — Controlled Substance Vault", floor: "Moffitt 1st Floor", qty: 280, storageType: "cage" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 60, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 50, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 40, storageType: "pyxis" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 50, storageType: "pyxis" },
    { location: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", qty: 40, storageType: "pyxis" },
  ],
  "INV-033": [ // Midazolam 5mg/mL (Controlled Substance)
    { location: "Pharmacy — Controlled Substance Vault", floor: "Moffitt 1st Floor", qty: 200, storageType: "cage" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 50, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 40, storageType: "pyxis" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 60, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 30, storageType: "pyxis" },
  ],
  "INV-034": [ // Vancomycin 1g IV
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 250, storageType: "shelf" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 60, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 50, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 40, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 11th", floor: "Long 11th Floor", qty: 50, storageType: "pyxis" },
  ],
  "INV-035": [ // Ceftriaxone 1g IV
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 200, storageType: "shelf" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 60, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 50, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 40, storageType: "pyxis" },
    { location: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", qty: 30, storageType: "pyxis" },
  ],
  "INV-037": [ // Epinephrine 1mg/mL (1:1000)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 100, storageType: "refrigerator" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 40, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 35, storageType: "pyxis" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 35, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 30, storageType: "pyxis" },
  ],
  "INV-038": [ // Norepinephrine 4mg/4mL
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 80, storageType: "refrigerator" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 50, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 30, storageType: "pyxis" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 20, storageType: "pyxis" },
  ],
  "INV-039": [ // Insulin Glargine (LOW STOCK)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 60, storageType: "refrigerator" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 15, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 20, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 11th", floor: "Long 11th Floor", qty: 15, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 10, storageType: "pyxis" },
  ],
  "INV-040": [ // Ondansetron 4mg/2mL (Zofran)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 400, storageType: "shelf" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 100, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 80, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 80, storageType: "pyxis" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 90, storageType: "pyxis" },
    { location: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", qty: 100, storageType: "pyxis" },
  ],
  "INV-041": [ // Ketorolac 30mg/mL (Toradol)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 180, storageType: "shelf" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 80, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 50, storageType: "pyxis" },
    { location: "OR Anesthesia Pyxis", floor: "Long 3rd Floor", qty: 60, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 40, storageType: "pyxis" },
  ],
  "INV-042": [ // Lorazepam 2mg/mL (Ativan) (Controlled Substance)
    { location: "Pharmacy — Controlled Substance Vault", floor: "Moffitt 1st Floor", qty: 130, storageType: "cage" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 40, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 35, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 30, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 11th", floor: "Long 11th Floor", qty: 25, storageType: "pyxis" },
  ],
  "INV-045": [ // Cisplatin 50mg/50mL (LOW STOCK)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 40, storageType: "refrigerator" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 25, storageType: "refrigerator" },
  ],
  "INV-046": [ // Pembrolizumab 100mg/4mL (Keytruda) (LOW STOCK)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 14, storageType: "refrigerator" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 10, storageType: "refrigerator" },
  ],
  "INV-047": [ // Alteplase 100mg (tPA)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 8, storageType: "refrigerator" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 4, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 3, storageType: "pyxis" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 3, storageType: "refrigerator" },
  ],
  "INV-048": [ // Levetiracetam 500mg/5mL IV (Keppra)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 160, storageType: "shelf" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 50, storageType: "pyxis" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 50, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 30, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 11th", floor: "Long 11th Floor", qty: 30, storageType: "pyxis" },
  ],
  "INV-049": [ // Amiodarone 150mg/3mL IV
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 90, storageType: "shelf" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 35, storageType: "pyxis" },
    { location: "ED Pyxis Station", floor: "Moffitt 1st Floor", qty: 35, storageType: "pyxis" },
    { location: "Med/Surg Pyxis — Long 14th", floor: "Long 14th Floor", qty: 30, storageType: "pyxis" },
  ],
  "INV-051": [ // Suture — Monocryl 3-0
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 160, storageType: "cabinet" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 60, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 40, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 20, storageType: "cabinet" },
  ],
  "INV-054": [ // Surgical Drape Kit — Hip
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 65, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 30, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 15, storageType: "shelf" },
  ],
  "INV-055": [ // Laparoscopic Trocar Kit
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 55, storageType: "cabinet" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 25, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 15, storageType: "shelf" },
  ],
  "INV-056": [ // Bone Cement 40g (LOW STOCK)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 30, storageType: "cabinet" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 10, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 8, storageType: "shelf" },
  ],
  "INV-058": [ // Cautery Pencil — Disposable
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 180, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 60, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 50, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 30, storageType: "shelf" },
  ],
  "INV-060": [ // Bone Graft Substitute 10cc (LOW STOCK)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 15, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 7, storageType: "shelf" },
  ],
  "INV-061": [ // Endotracheal Tube 7.0mm
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 80, storageType: "cabinet" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 50, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 40, storageType: "shelf" },
    { location: "OR Anesthesia Workroom", floor: "Long 3rd Floor", qty: 30, storageType: "cabinet" },
  ],
  "INV-063": [ // Oxygen Nasal Cannula (Adult)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 1200, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 500, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 400, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 400, storageType: "shelf" },
    { location: "Parnassus Med/Surg 11 Long", floor: "Long 11th Floor", qty: 400, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 300, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 300, storageType: "shelf" },
  ],
  "INV-064": [ // High-Flow Nasal Cannula Kit (LOW STOCK)
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 25, storageType: "cabinet" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 15, storageType: "cabinet" },
    { location: "Respiratory Therapy — Parnassus", floor: "Moffitt 8th Floor", qty: 15, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10, storageType: "shelf" },
  ],
  "INV-065": [ // Suction Catheter 14Fr
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 180, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 100, storageType: "shelf" },
    { location: "Respiratory Therapy — Parnassus", floor: "Moffitt 8th Floor", qty: 80, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 120, storageType: "shelf" },
  ],
  "INV-067": [ // Blood Collection Tubes (Heparin — Green)
    { location: "Lab Supply Room — Parnassus", floor: "Moffitt 1st Floor", qty: 5000, storageType: "shelf" },
    { location: "Lab — Blood Bank", floor: "Moffitt 1st Floor", qty: 2500, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 2000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 1200, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 800, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 500, storageType: "shelf" },
  ],
  "INV-069": [ // Blood Collection Tubes (SST — Gold)
    { location: "Lab Supply Room — Parnassus", floor: "Moffitt 1st Floor", qty: 4500, storageType: "shelf" },
    { location: "Lab — Blood Bank", floor: "Moffitt 1st Floor", qty: 2500, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 1800, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 1000, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 700, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 500, storageType: "shelf" },
  ],
  "INV-071": [ // Rapid Strep Test Kit
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 800, storageType: "shelf" },
    { location: "Lab — Testing Area", floor: "Moffitt 1st Floor", qty: 600, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 500, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 300, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 200, storageType: "shelf" },
  ],
  "INV-072": [ // Troponin I Test Cartridge
    { location: "Lab Supply Room — Parnassus", floor: "Moffitt 1st Floor", qty: 600, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 500, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 300, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 400, storageType: "shelf" },
  ],
  "INV-073": [ // Blood Gas Syringe Kit
    { location: "Lab Supply Room — Parnassus", floor: "Moffitt 1st Floor", qty: 800, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 400, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 400, storageType: "shelf" },
    { location: "Respiratory Therapy — Parnassus", floor: "Moffitt 8th Floor", qty: 300, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 300, storageType: "shelf" },
  ],
  "INV-077": [ // Tegaderm Transparent Dressing (10x12cm)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 1800, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 600, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 500, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 600, storageType: "shelf" },
    { location: "Parnassus Med/Surg 11 Long", floor: "Long 11th Floor", qty: 500, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 400, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 400, storageType: "shelf" },
  ],
  "INV-078": [ // Sterile Gauze Pads 4x4 (12-ply)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 6000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 2000, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 1500, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 1500, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 2000, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 1000, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 1000, storageType: "shelf" },
  ],
  "INV-079": [ // Alcohol Prep Pads
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10000, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 4000, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 3000, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 3000, storageType: "shelf" },
    { location: "Parnassus Med/Surg 11 Long", floor: "Long 11th Floor", qty: 2000, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 3000, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 3000, storageType: "shelf" },
  ],
  "INV-080": [ // Pressure Injury Prevention Mattress Overlay (LOW STOCK)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 12, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 6, storageType: "shelf" },
    { location: "Parnassus Med/Surg 11 Long", floor: "Long 11th Floor", qty: 5, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 4, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 3, storageType: "shelf" },
  ],
  "INV-082": [ // Chest Tube Drainage Kit (28Fr)
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 15, storageType: "cabinet" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 12, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 8, storageType: "cabinet" },
  ],
  "INV-083": [ // Fetal Scalp Electrode
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 90, storageType: "shelf" },
    { location: "Mission Bay L&D Medication Room", floor: "Mission Bay 4th Floor", qty: 30, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 20, storageType: "shelf" },
  ],
  "INV-084": [ // Amniotomy Hook (Disposable)
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 130, storageType: "shelf" },
    { location: "Mission Bay L&D Medication Room", floor: "Mission Bay 4th Floor", qty: 40, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 30, storageType: "shelf" },
  ],
  "INV-085": [ // C-Section Drape Kit
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 50, storageType: "shelf" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 25, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 15, storageType: "shelf" },
  ],
  "INV-086": [ // Infant Warmer Liner
    { location: "Mission Bay L&D Supply", floor: "Mission Bay 4th Floor", qty: 220, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 80, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 50, storageType: "shelf" },
  ],
  "INV-087": [ // Magnesium Sulfate 4g/100mL IV (LOW STOCK)
    { location: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", qty: 30, storageType: "shelf" },
    { location: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", qty: 25, storageType: "pyxis" },
    { location: "Mission Bay L&D Medication Room", floor: "Mission Bay 4th Floor", qty: 15, storageType: "shelf" },
    { location: "ICU Pyxis Station", floor: "Moffitt 8th Floor", qty: 10, storageType: "pyxis" },
  ],
  "INV-089": [ // Intracranial Pressure Monitor Kit (LOW STOCK)
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 8, storageType: "cabinet" },
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 4, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 3, storageType: "shelf" },
  ],
  "INV-090": [ // Cardiac Catheterization Kit
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 20, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 5, storageType: "shelf" },
  ],
  "INV-091": [ // Drug-Eluting Stent (3.0x18mm)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 18, storageType: "cabinet" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10, storageType: "shelf" },
  ],
  "INV-092": [ // ECG Electrode Pads (50-pack)
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 800, storageType: "shelf" },
    { location: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", qty: 400, storageType: "shelf" },
    { location: "Parnassus ICU Supply Room", floor: "Moffitt 8th Floor", qty: 300, storageType: "shelf" },
    { location: "Parnassus Med/Surg 14 Long", floor: "Long 14th Floor", qty: 300, storageType: "shelf" },
    { location: "Mission Bay Supply Room", floor: "Mission Bay 2nd Floor", qty: 300, storageType: "shelf" },
    { location: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", qty: 300, storageType: "shelf" },
  ],
  "INV-093": [ // Surgical Stapler (Endo GIA 60mm)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 35, storageType: "cabinet" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 15, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 10, storageType: "shelf" },
  ],
  "INV-094": [ // Surgical Stapler Reload (Endo GIA 60mm)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 80, storageType: "shelf" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 35, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 25, storageType: "shelf" },
  ],
  "INV-095": [ // Cell Saver Tubing Set (LOW STOCK)
    { location: "Parnassus OR Supply Core", floor: "Long 3rd Floor", qty: 15, storageType: "cabinet" },
    { location: "SPD — Sterile Processing", floor: "Basement", qty: 6, storageType: "shelf" },
    { location: "Parnassus Central Warehouse", floor: "Basement", qty: 4, storageType: "shelf" },
  ],
};

// Joint Commission Compliance Data
export type ComplianceChapter = {
  id: string;
  code: string;
  name: string;
  score: number;
  totalRequirements: number;
  metRequirements: number;
  findings: number;
  lastAssessed: string;
  trend: "improving" | "stable" | "declining";
};

export const complianceChapters: ComplianceChapter[] = [
  { id: "ec", code: "EC", name: "Environment of Care", score: 87, totalRequirements: 42, metRequirements: 37, findings: 5, lastAssessed: "2026-03-10", trend: "improving" },
  { id: "mm", code: "MM", name: "Medication Management", score: 92, totalRequirements: 38, metRequirements: 35, findings: 3, lastAssessed: "2026-03-12", trend: "stable" },
  { id: "ic", code: "IC", name: "Infection Prevention & Control", score: 78, totalRequirements: 28, metRequirements: 22, findings: 6, lastAssessed: "2026-03-08", trend: "declining" },
  { id: "em", code: "EM", name: "Emergency Management", score: 84, totalRequirements: 24, metRequirements: 20, findings: 4, lastAssessed: "2026-03-05", trend: "improving" },
  { id: "im", code: "IM", name: "Information Management", score: 95, totalRequirements: 20, metRequirements: 19, findings: 1, lastAssessed: "2026-03-14", trend: "stable" },
  { id: "ld", code: "LD", name: "Leadership", score: 91, totalRequirements: 32, metRequirements: 29, findings: 3, lastAssessed: "2026-03-11", trend: "stable" },
  { id: "npsg", code: "NPSG", name: "National Patient Safety Goals", score: 89, totalRequirements: 18, metRequirements: 16, findings: 2, lastAssessed: "2026-03-13", trend: "improving" },
];

export const overallReadinessScore = 88;

// Equipment Registry
export type Equipment = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  department: string;
  riskLevel: "high" | "medium" | "low";
  isLifeSupport: boolean;
  lastPM: string;
  nextPM: string;
  pmStatus: "current" | "due-soon" | "overdue";
  aemApplied: boolean;
  status: "operational" | "maintenance" | "out-of-service";
};

export const equipmentRegistry: Equipment[] = [
  { id: "EQ-001", name: "Ventilator", model: "Puritan Bennett 980", manufacturer: "Medtronic", serialNumber: "PB980-2024-1847", department: "ICU", riskLevel: "high", isLifeSupport: true, lastPM: "2026-01-15", nextPM: "2026-04-15", pmStatus: "current", aemApplied: false, status: "operational" },
  { id: "EQ-002", name: "Patient Monitor", model: "IntelliVue MX800", manufacturer: "Philips", serialNumber: "IX800-2023-0934", department: "ICU", riskLevel: "high", isLifeSupport: false, lastPM: "2025-12-20", nextPM: "2026-03-20", pmStatus: "due-soon", aemApplied: false, status: "operational" },
  { id: "EQ-003", name: "Infusion Pump", model: "Alaris 8015", manufacturer: "BD Medical", serialNumber: "AL8015-2024-2156", department: "Med/Surg", riskLevel: "high", isLifeSupport: false, lastPM: "2025-11-10", nextPM: "2026-02-10", pmStatus: "overdue", aemApplied: false, status: "operational" },
  { id: "EQ-004", name: "Defibrillator", model: "LIFEPAK 20e", manufacturer: "Stryker", serialNumber: "LP20E-2023-0478", department: "Emergency Department", riskLevel: "high", isLifeSupport: true, lastPM: "2026-02-28", nextPM: "2026-05-28", pmStatus: "current", aemApplied: false, status: "operational" },
  { id: "EQ-005", name: "Anesthesia Machine", model: "Aisys CS2", manufacturer: "GE Healthcare", serialNumber: "ACS2-2024-0312", department: "Operating Rooms", riskLevel: "high", isLifeSupport: true, lastPM: "2026-01-05", nextPM: "2026-04-05", pmStatus: "current", aemApplied: false, status: "operational" },
  { id: "EQ-006", name: "Ultrasound System", model: "LOGIQ E10s", manufacturer: "GE Healthcare", serialNumber: "LGE10-2024-0567", department: "Emergency Department", riskLevel: "medium", isLifeSupport: false, lastPM: "2025-10-15", nextPM: "2026-01-15", pmStatus: "overdue", aemApplied: true, status: "maintenance" },
  { id: "EQ-007", name: "Autoclave Sterilizer", model: "AMSCO 400", manufacturer: "STERIS", serialNumber: "AM400-2022-0189", department: "Materials Management", riskLevel: "medium", isLifeSupport: false, lastPM: "2026-02-01", nextPM: "2026-05-01", pmStatus: "current", aemApplied: true, status: "operational" },
  { id: "EQ-008", name: "Blood Gas Analyzer", model: "ABL90 FLEX PLUS", manufacturer: "Radiometer", serialNumber: "ABL90-2024-0723", department: "Laboratory", riskLevel: "medium", isLifeSupport: false, lastPM: "2026-03-01", nextPM: "2026-06-01", pmStatus: "current", aemApplied: false, status: "operational" },
  { id: "EQ-009", name: "Fetal Monitor", model: "Series 700", manufacturer: "GE Healthcare", serialNumber: "S700-2023-0456", department: "Labor & Delivery", riskLevel: "high", isLifeSupport: false, lastPM: "2025-12-01", nextPM: "2026-03-01", pmStatus: "overdue", aemApplied: false, status: "operational" },
  { id: "EQ-010", name: "Electrosurgical Unit", model: "Force FX-C", manufacturer: "Medtronic", serialNumber: "FFX-2024-0834", department: "Operating Rooms", riskLevel: "medium", isLifeSupport: false, lastPM: "2026-02-15", nextPM: "2026-05-15", pmStatus: "current", aemApplied: true, status: "operational" },
];

// AI Demand Forecast Data
export const demandForecastData = [
  { date: "Mar 1", actual: 2400, predicted: 2350, lower: 2200, upper: 2500 },
  { date: "Mar 3", actual: 2550, predicted: 2420, lower: 2270, upper: 2570 },
  { date: "Mar 5", actual: 2300, predicted: 2380, lower: 2230, upper: 2530 },
  { date: "Mar 7", actual: 2680, predicted: 2500, lower: 2350, upper: 2650 },
  { date: "Mar 9", actual: 2450, predicted: 2460, lower: 2310, upper: 2610 },
  { date: "Mar 11", actual: 2720, predicted: 2580, lower: 2430, upper: 2730 },
  { date: "Mar 13", actual: 2890, predicted: 2700, lower: 2550, upper: 2850 },
  { date: "Mar 15", actual: 2780, predicted: 2750, lower: 2600, upper: 2900 },
  { date: "Mar 17", actual: null, predicted: 2820, lower: 2620, upper: 2970 },
  { date: "Mar 19", actual: null, predicted: 2900, lower: 2680, upper: 3050 },
  { date: "Mar 21", actual: null, predicted: 2850, lower: 2630, upper: 3010 },
  { date: "Mar 23", actual: null, predicted: 3100, lower: 2850, upper: 3280 },
  { date: "Mar 25", actual: null, predicted: 3250, lower: 2980, upper: 3450 },
  { date: "Mar 27", actual: null, predicted: 3180, lower: 2900, upper: 3380 },
  { date: "Mar 29", actual: null, predicted: 3050, lower: 2780, upper: 3250 },
];

export const departmentConsumption = [
  { department: "ED", current: 5600, predicted: 6200, change: 10.7 },
  { department: "OR", current: 4400, predicted: 4900, change: 11.4 },
  { department: "Pharmacy", current: 7000, predicted: 7300, change: 4.3 },
  { department: "ICU", current: 3600, predicted: 4200, change: 16.7 },
  { department: "Materials Mgmt", current: 10400, predicted: 10800, change: 3.8 },
  { department: "Med/Surg", current: 2800, predicted: 3000, change: 7.1 },
  { department: "L&D", current: 1800, predicted: 1900, change: 5.6 },
  { department: "Lab", current: 4000, predicted: 4300, change: 7.5 },
];

// AI Alerts/Insights
export type AIInsight = {
  id: string;
  type: "prediction" | "anomaly" | "recommendation" | "outbreak" | "cost-saving";
  severity: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  timestamp: string;
  actionable: boolean;
  suggestedAction?: string;
  impact?: string;
};

export const aiInsights: AIInsight[] = [
  {
    id: "AI-001",
    type: "outbreak",
    severity: "high",
    title: "Flu Surge Predicted — Bay Area",
    description: "CDC ILINet data shows 34% week-over-week increase in influenza-like illness in San Francisco County. Wastewater surveillance confirms rising viral load. Additionally, 30 flu vaccination appointments have been booked this month — a 3x increase over February — signaling heightened community awareness and demand. Model predicts 40-60% increase in ED respiratory visits within 7-10 days.",
    timestamp: "2026-03-15T08:30:00",
    actionable: true,
    suggestedAction: "Pre-order additional flu vaccine doses (est. 50 units), Tamiflu (est. 200 units), rapid flu tests (est. 1,500 units), N95 masks (est. 3,000 units), and vaccination supplies (syringes, alcohol pads). Auto-adjust PAR levels for respiratory supplies.",
    impact: "Prevents estimated $45,000 in emergency procurement costs",
  },
  {
    id: "AI-002",
    type: "anomaly",
    severity: "high",
    title: "Unusual Fentanyl Consumption — ICU",
    description: "Fentanyl usage in ICU has increased 47% over the past 5 days without a corresponding increase in patient census or acuity scores. Pattern deviates significantly from historical norms.",
    timestamp: "2026-03-15T06:15:00",
    actionable: true,
    suggestedAction: "Flag for pharmacy review and controlled substance audit. Cross-reference with patient administration records.",
    impact: "Potential diversion risk — requires immediate investigation",
  },
  {
    id: "AI-003",
    type: "prediction",
    severity: "medium",
    title: "Surgical Volume Spike — Week of Mar 23",
    description: "OR scheduling data shows 28 total knee replacements and 15 hip replacements booked for next week (vs. 18 and 9 typical). Procedure-specific consumption model projects supply shortfalls in 3 categories.",
    timestamp: "2026-03-15T07:00:00",
    actionable: true,
    suggestedAction: "Increase orders: Surgical Drape Kits (+15), Vicryl 3-0 Sutures (+40), Bone Cement (+12). Place orders by Mar 18 to meet lead times.",
    impact: "Prevents potential case delays saving ~$8,200/case in OR downtime costs",
  },
  {
    id: "AI-004",
    type: "cost-saving",
    severity: "info",
    title: "Vendor Consolidation Opportunity",
    description: "Analysis shows 3 separate vendors supplying similar-spec nitrile gloves across 5 campuses at varying price points ($0.09–$0.15/unit). Consolidating to Medline's Vizient contract pricing would standardize at $0.10/unit.",
    timestamp: "2026-03-14T14:00:00",
    actionable: true,
    suggestedAction: "Initiate vendor consolidation review. Estimated annual savings: $23,400.",
    impact: "$23,400 annual cost reduction",
  },
  {
    id: "AI-005",
    type: "recommendation",
    severity: "medium",
    title: "96-Hour Emergency Stockpile Below Target",
    description: "Current emergency reserves would sustain operations for approximately 72 hours at current consumption rates — below the Joint Commission EM.12.02.09 requirement of 96 hours. Critical gaps in IV fluids and ventilator circuits.",
    timestamp: "2026-03-14T10:30:00",
    actionable: true,
    suggestedAction: "Increase emergency stockpile: Normal Saline 0.9% (+400 bags), Lactated Ringer's (+200 bags), Ventilator Circuits (+30 units). Estimated cost: $8,750.",
    impact: "Closes Joint Commission EM compliance gap — adds 3.2 points to readiness score",
  },
  {
    id: "AI-006",
    type: "prediction",
    severity: "low",
    title: "COVID Test Expiration — Action Needed",
    description: "2,100 rapid COVID-19 antigen tests (lot LT-2026-0567) expire April 30, 2026. Current consumption rate: ~45 tests/day. At this rate, approximately 1,075 tests will expire unused.",
    timestamp: "2026-03-13T16:00:00",
    actionable: true,
    suggestedAction: "Explore redistribution to Mission Bay, Mount Zion, and Benioff campuses, or coordinate with SF Department of Public Health for community testing events.",
    impact: "Prevents $5,644 in waste from expired inventory",
  },
];

// Analytics Data
export const monthlyCostTrend = [
  { month: "Oct", actual: 2676000, budget: 2700000 },
  { month: "Nov", actual: 2835000, budget: 2700000 },
  { month: "Dec", actual: 3060000, budget: 2760000 },
  { month: "Jan", actual: 2634000, budget: 2730000 },
  { month: "Feb", actual: 2802000, budget: 2730000 },
  { month: "Mar", actual: 2568000, budget: 2745000 },
];

export const supplierPerformance = [
  { name: "Medline Industries", onTimeRate: 96.2, fillRate: 98.5, avgLeadDays: 2.1, orders: 426, spend: 861000 },
  { name: "Cardinal Health", onTimeRate: 93.8, fillRate: 97.2, avgLeadDays: 2.8, orders: 294, spend: 642000 },
  { name: "BD Medical", onTimeRate: 91.5, fillRate: 95.8, avgLeadDays: 3.4, orders: 228, spend: 534000 },
  { name: "McKesson", onTimeRate: 94.1, fillRate: 96.9, avgLeadDays: 2.3, orders: 360, spend: 1026000 },
  { name: "Pfizer", onTimeRate: 89.7, fillRate: 94.1, avgLeadDays: 5.2, orders: 102, spend: 468000 },
  { name: "Medtronic", onTimeRate: 97.3, fillRate: 99.1, avgLeadDays: 4.1, orders: 84, spend: 1236000 },
];

export const inventoryTurnover = [
  { department: "ED", turnover: 14.2, benchmark: 12.0 },
  { department: "OR", turnover: 8.7, benchmark: 10.0 },
  { department: "Pharmacy", turnover: 18.5, benchmark: 15.0 },
  { department: "Materials Management", turnover: 11.3, benchmark: 12.0 },
  { department: "ICU", turnover: 16.1, benchmark: 14.0 },
  { department: "Med/Surg", turnover: 10.8, benchmark: 11.0 },
  { department: "L&D", turnover: 9.4, benchmark: 10.0 },
  { department: "Lab", turnover: 13.7, benchmark: 12.0 },
];

// Scheduled surgeries for appointment-driven forecasting
// Each surgery type maps to specific supplies it consumes
export const procedureSupplyProfiles: Record<string, { supply: string; qty: number; unitCost: number }[]> = {
  "Total Knee": [
    { supply: "Surgical Drape Kit — Total Knee", qty: 1, unitCost: 34.00 },
    { supply: "Vicryl 3-0 Suture", qty: 2, unitCost: 9.80 },
    { supply: "Bone Cement 40g", qty: 1, unitCost: 45.00 },
    { supply: "Sterile Surgical Gown (L)", qty: 3, unitCost: 6.75 },
    { supply: "Nitrile Gloves (pair)", qty: 8, unitCost: 0.24 },
  ],
  "Hip Replacement": [
    { supply: "Surgical Drape Kit — Hip", qty: 1, unitCost: 38.00 },
    { supply: "Vicryl 3-0 Suture", qty: 3, unitCost: 9.80 },
    { supply: "Bone Cement 40g", qty: 2, unitCost: 45.00 },
    { supply: "Sterile Surgical Gown (L)", qty: 4, unitCost: 6.75 },
    { supply: "Hemovac Drain", qty: 1, unitCost: 22.00 },
  ],
  "Appendectomy": [
    { supply: "Laparoscopic Trocar Kit", qty: 1, unitCost: 28.00 },
    { supply: "Vicryl 3-0 Suture", qty: 1, unitCost: 9.80 },
    { supply: "Sterile Surgical Gown (L)", qty: 2, unitCost: 6.75 },
    { supply: "Specimen Container", qty: 1, unitCost: 2.50 },
  ],
  "C-Section": [
    { supply: "C-Section Drape Kit", qty: 1, unitCost: 32.00 },
    { supply: "Vicryl 3-0 Suture", qty: 2, unitCost: 9.80 },
    { supply: "Sterile Surgical Gown (L)", qty: 3, unitCost: 6.75 },
    { supply: "Oxytocin 10U/mL", qty: 2, unitCost: 5.60 },
    { supply: "Infant Warmer Liner", qty: 1, unitCost: 8.50 },
  ],
  "Spinal Fusion": [
    { supply: "Spinal Drape Kit", qty: 1, unitCost: 42.00 },
    { supply: "Vicryl 3-0 Suture", qty: 4, unitCost: 9.80 },
    { supply: "Bone Graft Substitute 10cc", qty: 1, unitCost: 320.00 },
    { supply: "Sterile Surgical Gown (L)", qty: 4, unitCost: 6.75 },
    { supply: "Hemovac Drain", qty: 1, unitCost: 22.00 },
  ],
};

export const upcomingSurgeries = [
  { date: "Mar 17", day: "Monday", procedures: 12,
    types: { "Total Knee": 4, "Hip Replacement": 2, "Appendectomy": 3, "C-Section": 3 },
    cases: [
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "11:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Nakamura", or: "OR-3", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-5", time: "14:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "08:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "10:30" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "13:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "07:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "10:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "13:00" },
    ],
  },
  { date: "Mar 18", day: "Tuesday", procedures: 15,
    types: { "Total Knee": 5, "Hip Replacement": 3, "Appendectomy": 2, "Spinal Fusion": 2, "C-Section": 3 },
    cases: [
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-5", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Nakamura", or: "OR-4", time: "07:30" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-4", time: "11:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "08:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "10:30" },
      { procedure: "Spinal Fusion", surgeon: "Dr. Vasquez", or: "OR-6", time: "07:30" },
      { procedure: "Spinal Fusion", surgeon: "Dr. Vasquez", or: "OR-6", time: "12:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "07:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "10:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "13:00" },
    ],
  },
  { date: "Mar 19", day: "Wednesday", procedures: 10,
    types: { "Total Knee": 3, "Appendectomy": 4, "C-Section": 3 },
    cases: [
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "11:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "08:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "10:30" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "13:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "15:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "07:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "10:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "13:00" },
    ],
  },
  { date: "Mar 20", day: "Thursday", procedures: 18,
    types: { "Total Knee": 6, "Hip Replacement": 4, "Spinal Fusion": 3, "C-Section": 5 },
    cases: [
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "14:00" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Nakamura", or: "OR-4", time: "07:30" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-4", time: "11:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Nakamura", or: "OR-4", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-4", time: "16:00" },
      { procedure: "Spinal Fusion", surgeon: "Dr. Vasquez", or: "OR-6", time: "07:30" },
      { procedure: "Spinal Fusion", surgeon: "Dr. Vasquez", or: "OR-6", time: "12:00" },
      { procedure: "Spinal Fusion", surgeon: "Dr. Vasquez", or: "OR-6", time: "16:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "07:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "09:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "11:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "13:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "15:30" },
    ],
  },
  { date: "Mar 21", day: "Friday", procedures: 14,
    types: { "Total Knee": 5, "Hip Replacement": 3, "Appendectomy": 3, "C-Section": 3 },
    cases: [
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "07:30" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Patel", or: "OR-5", time: "11:00" },
      { procedure: "Total Knee", surgeon: "Dr. Nakamura", or: "OR-3", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-5", time: "14:00" },
      { procedure: "Hip Replacement", surgeon: "Dr. Nakamura", or: "OR-4", time: "07:30" },
      { procedure: "Hip Replacement", surgeon: "Dr. Patel", or: "OR-4", time: "11:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "08:00" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "10:30" },
      { procedure: "Appendectomy", surgeon: "Dr. Kim", or: "OR-1", time: "13:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "07:30" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "10:00" },
      { procedure: "C-Section", surgeon: "Dr. Chen", or: "OR-2", time: "13:00" },
    ],
  },
];

// Compliance findings for corrective action tracking
export type ComplianceFinding = {
  id: string;
  chapter: string;
  standard: string;
  description: string;
  severity: "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved";
  dateIdentified: string;
  dueDate: string;
  assignedTo: string;
};

export const complianceFindings: ComplianceFinding[] = [
  { id: "FND-001", chapter: "EC", standard: "EC.02.04.01 EP 2", description: "3 infusion pumps in Med/Surg not included in equipment inventory registry", severity: "high", status: "in-progress", dateIdentified: "2026-03-08", dueDate: "2026-03-22", assignedTo: "Biomed Engineering" },
  { id: "FND-002", chapter: "EC", standard: "EC.02.04.03 EP 1", description: "Preventive maintenance overdue on Ultrasound System (LOGIQ E10s) — 60 days past due", severity: "high", status: "open", dateIdentified: "2026-03-10", dueDate: "2026-03-20", assignedTo: "Biomed Engineering" },
  { id: "FND-003", chapter: "MM", standard: "MM 13.01.01 EP 1", description: "Incomplete disposition records for controlled substance returns in Pharmacy for Feb 2026", severity: "medium", status: "in-progress", dateIdentified: "2026-03-05", dueDate: "2026-03-19", assignedTo: "Pharmacy Director" },
  { id: "FND-004", chapter: "IC", standard: "IC.01.05.01 EP 3", description: "Hand hygiene supply dispensers empty in 4 of 12 patient care areas during walkthrough", severity: "high", status: "open", dateIdentified: "2026-03-12", dueDate: "2026-03-16", assignedTo: "Environmental Services" },
  { id: "FND-005", chapter: "IC", standard: "IC.02.02.01 EP 1", description: "PPE stock in isolation cart on 3 East below minimum threshold for 48-hour coverage", severity: "medium", status: "open", dateIdentified: "2026-03-11", dueDate: "2026-03-18", assignedTo: "Materials Management" },
  { id: "FND-006", chapter: "EM", standard: "EM.12.02.09 EP 1", description: "96-hour sustainability calculation not updated since Jan 2026 — does not reflect current consumption rates", severity: "medium", status: "in-progress", dateIdentified: "2026-03-05", dueDate: "2026-03-25", assignedTo: "Emergency Management" },
  { id: "FND-007", chapter: "EC", standard: "EC.02.04.01 EP 3", description: "Fetal Monitor (Series 700) not classified as high-risk despite use in continuous intrapartum monitoring", severity: "high", status: "open", dateIdentified: "2026-03-09", dueDate: "2026-03-23", assignedTo: "Biomed Engineering" },
  { id: "FND-008", chapter: "IC", standard: "IC.02.01.01 EP 5", description: "Insufficient N95 fit-test kits available — 40% of respiratory therapy staff overdue for annual fit testing", severity: "medium", status: "in-progress", dateIdentified: "2026-03-06", dueDate: "2026-03-30", assignedTo: "Infection Prevention" },
];

// ============================================================
// Budget & Delivery Forecast Data
// ============================================================

// Annual budget allocation by category
export const budgetAllocation = [
  { category: "PPE & Safety", annualBudget: 4_260_000, ytdSpend: 1_926_000, ytdBudget: 1_776_000, forecast: 4_620_000 },
  { category: "Medications (Non-Controlled)", annualBudget: 8_550_000, ytdSpend: 3_540_000, ytdBudget: 3_564_000, forecast: 8_490_000 },
  { category: "Controlled Substances", annualBudget: 2_040_000, ytdSpend: 885_000, ytdBudget: 849_000, forecast: 2_130_000 },
  { category: "Surgical Supplies", annualBudget: 9_600_000, ytdSpend: 4_140_000, ytdBudget: 3_999_000, forecast: 9_930_000 },
  { category: "Laboratory Supplies", annualBudget: 2_670_000, ytdSpend: 1_095_000, ytdBudget: 1_113_000, forecast: 2_625_000 },
  { category: "Respiratory / ICU", annualBudget: 2_160_000, ytdSpend: 936_000, ytdBudget: 900_000, forecast: 2_250_000 },
  { category: "General Medical Supplies", annualBudget: 4_920_000, ytdSpend: 2_085_000, ytdBudget: 2_049_000, forecast: 4_980_000 },
];

// Current inventory valuation by department
export const inventoryValuation = [
  { department: "Materials Management", itemCount: 11246, totalValue: 974_400, avgDaysOnHand: 18.4 },
  { department: "Pharmacy", itemCount: 6430, totalValue: 1_785_000, avgDaysOnHand: 12.1 },
  { department: "Operating Rooms", itemCount: 4872, totalValue: 1_290_600, avgDaysOnHand: 8.7 },
  { department: "Emergency Department", itemCount: 3245, totalValue: 468_200, avgDaysOnHand: 6.2 },
  { department: "Laboratory", itemCount: 4218, totalValue: 356_800, avgDaysOnHand: 14.5 },
  { department: "Intensive Care Unit", itemCount: 2912, totalValue: 625_400, avgDaysOnHand: 9.3 },
  { department: "Med/Surg", itemCount: 2468, totalValue: 313_600, avgDaysOnHand: 11.6 },
  { department: "Labor & Delivery", itemCount: 1974, totalValue: 249_000, avgDaysOnHand: 15.2 },
];

// Upcoming purchase orders (pending + AI-recommended)
export type PurchaseOrder = {
  id: string;
  supplier: string;
  status: "pending-approval" | "approved" | "ai-recommended" | "submitted" | "in-transit";
  items: { name: string; qty: number; unitCost: number }[];
  totalCost: number;
  orderDate: string;
  expectedDelivery: string;
  department: string;
  triggeredBy: "auto-reorder" | "ai-forecast" | "manual" | "par-trigger";
};

export const upcomingPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-4521",
    supplier: "Pfizer",
    status: "submitted",
    items: [
      { name: "Heparin Sodium 5000U/mL", qty: 200, unitCost: 8.75 },
    ],
    totalCost: 1_750,
    orderDate: "2026-03-15",
    expectedDelivery: "2026-03-20",
    department: "Pharmacy",
    triggeredBy: "par-trigger",
  },
  {
    id: "PO-4522",
    supplier: "Ethicon (J&J)",
    status: "pending-approval",
    items: [
      { name: "Vicryl 3-0 Suture", qty: 200, unitCost: 9.80 },
      { name: "Vicryl 2-0 Suture", qty: 100, unitCost: 10.20 },
    ],
    totalCost: 2_980,
    orderDate: "2026-03-15",
    expectedDelivery: "2026-03-19",
    department: "Operating Rooms",
    triggeredBy: "par-trigger",
  },
  {
    id: "PO-4523",
    supplier: "Fisher & Paykel",
    status: "ai-recommended",
    items: [
      { name: "Ventilator Circuit (Adult)", qty: 50, unitCost: 18.50 },
      { name: "Humidifier Chamber", qty: 25, unitCost: 12.00 },
    ],
    totalCost: 1_225,
    orderDate: "2026-03-15",
    expectedDelivery: "2026-03-22",
    department: "ICU",
    triggeredBy: "ai-forecast",
  },
  {
    id: "PO-4524",
    supplier: "3M Healthcare",
    status: "ai-recommended",
    items: [
      { name: "N95 Respirator Masks", qty: 3000, unitCost: 1.85 },
      { name: "N95 Fit-Test Kit", qty: 10, unitCost: 45.00 },
    ],
    totalCost: 6_000,
    orderDate: "2026-03-15",
    expectedDelivery: "2026-03-18",
    department: "Materials Management",
    triggeredBy: "ai-forecast",
  },
  {
    id: "PO-4525",
    supplier: "Cardinal Health",
    status: "in-transit",
    items: [
      { name: "Surgical Drape Kit — Total Knee", qty: 30, unitCost: 34.00 },
      { name: "Surgical Drape Kit — Hip", qty: 20, unitCost: 38.00 },
    ],
    totalCost: 1_780,
    orderDate: "2026-03-13",
    expectedDelivery: "2026-03-17",
    department: "Operating Rooms",
    triggeredBy: "auto-reorder",
  },
  {
    id: "PO-4526",
    supplier: "Medline Industries",
    status: "approved",
    items: [
      { name: "Nitrile Examination Gloves (M)", qty: 5000, unitCost: 0.12 },
      { name: "Nitrile Examination Gloves (L)", qty: 3000, unitCost: 0.12 },
      { name: "Sterile Surgical Gown (L)", qty: 300, unitCost: 6.75 },
    ],
    totalCost: 2_985,
    orderDate: "2026-03-14",
    expectedDelivery: "2026-03-17",
    department: "Materials Management",
    triggeredBy: "auto-reorder",
  },
];

// Monthly spend forecast (historical + AI projected)
export const monthlySpendForecast = [
  { month: "Oct '25", actual: 2_676_000, budget: 2_700_000, forecast: null },
  { month: "Nov '25", actual: 2_835_000, budget: 2_700_000, forecast: null },
  { month: "Dec '25", actual: 3_060_000, budget: 2_760_000, forecast: null },
  { month: "Jan '26", actual: 2_634_000, budget: 2_730_000, forecast: null },
  { month: "Feb '26", actual: 2_802_000, budget: 2_730_000, forecast: null },
  { month: "Mar '26", actual: 1_704_000, budget: 2_745_000, forecast: 2_685_000 },
  { month: "Apr '26", actual: null, budget: 2_730_000, forecast: 2_826_000 },
  { month: "May '26", actual: null, budget: 2_730_000, forecast: 2_754_000 },
  { month: "Jun '26", actual: null, budget: 2_760_000, forecast: 2_895_000 },
];

// Upcoming deliveries (shipments already in-transit or confirmed)
export type Delivery = {
  id: string;
  poId: string;
  supplier: string;
  carrier: string;
  trackingStatus: "label-created" | "picked-up" | "in-transit" | "out-for-delivery" | "delivered";
  items: { name: string; qty: number }[];
  totalCost: number;
  shippedDate: string;
  estimatedArrival: string;
  shippingCost: number;
};

export const upcomingDeliveries: Delivery[] = [
  {
    id: "DEL-8901",
    poId: "PO-4525",
    supplier: "Cardinal Health",
    carrier: "UPS Freight",
    trackingStatus: "in-transit",
    items: [
      { name: "Surgical Drape Kit — Total Knee", qty: 30 },
      { name: "Surgical Drape Kit — Hip", qty: 20 },
    ],
    totalCost: 1_780,
    shippedDate: "2026-03-14",
    estimatedArrival: "2026-03-17",
    shippingCost: 85,
  },
  {
    id: "DEL-8902",
    poId: "PO-4526",
    supplier: "Medline Industries",
    carrier: "FedEx Ground",
    trackingStatus: "picked-up",
    items: [
      { name: "Nitrile Examination Gloves (M)", qty: 5000 },
      { name: "Nitrile Examination Gloves (L)", qty: 3000 },
      { name: "Sterile Surgical Gown (L)", qty: 300 },
    ],
    totalCost: 2_985,
    shippedDate: "2026-03-15",
    estimatedArrival: "2026-03-17",
    shippingCost: 120,
  },
  {
    id: "DEL-8903",
    poId: "PO-4519",
    supplier: "BD Medical",
    carrier: "UPS Ground",
    trackingStatus: "out-for-delivery",
    items: [
      { name: "IV Catheter 20G", qty: 300 },
      { name: "IV Catheter 18G", qty: 200 },
      { name: "Blood Collection Tubes (EDTA)", qty: 2000 },
    ],
    totalCost: 2_425,
    shippedDate: "2026-03-13",
    estimatedArrival: "2026-03-15",
    shippingCost: 65,
  },
];

// Delayed shipments — shipments that have missed or will miss their ETA
export type DelayedShipment = {
  id: string;
  poId: string;
  supplier: string;
  carrier: string;
  items: { name: string; qty: number }[];
  totalCost: number;
  originalEta: string;
  revisedEta: string | null;
  delayDays: number;
  reason: string;
  carrierUpdate: string;
  impactSeverity: "critical" | "high" | "medium";
  affectedDepartments: string[];
  inventoryImpact: string;
  mitigationOptions: string[];
};

export const delayedShipments: DelayedShipment[] = [
  {
    id: "DEL-8895",
    poId: "PO-4512",
    supplier: "Teleflex",
    carrier: "FedEx Freight",
    items: [
      { name: "Foley Catheter 16Fr", qty: 200 },
      { name: "Foley Catheter 18Fr", qty: 150 },
      { name: "Closed Suction Catheter", qty: 100 },
    ],
    totalCost: 3_420,
    originalEta: "2026-03-13",
    revisedEta: "2026-03-18",
    delayDays: 5,
    reason: "Warehouse fulfillment backlog at Teleflex Memphis distribution center",
    carrierUpdate: "Shipment picked up Mar 15 — in transit via FedEx Freight. Revised ETA: Mar 18.",
    impactSeverity: "high",
    affectedDepartments: ["Med/Surg", "ICU"],
    inventoryImpact: "Foley Catheter 16Fr stock at 210 units (PAR: 300). At current usage of 18/day, stock reaches zero by Mar 26 — but delayed arrival still covers need.",
    mitigationOptions: [
      "Transfer 50 Foley 16Fr from Materials Management surplus to Med/Surg",
      "No emergency order needed — revised ETA still within safety window",
    ],
  },
  {
    id: "DEL-8897",
    poId: "PO-4515",
    supplier: "Fresenius Kabi",
    carrier: "XPO Logistics",
    items: [
      { name: "Normal Saline 0.9% 1000mL", qty: 500 },
      { name: "Lactated Ringer's 1000mL", qty: 300 },
      { name: "D5W 1000mL", qty: 200 },
    ],
    totalCost: 8_750,
    originalEta: "2026-03-12",
    revisedEta: null,
    delayDays: 3,
    reason: "Production delay at Fresenius Kabi Wilson, NC plant — FDA inspection causing temporary shipping hold",
    carrierUpdate: "No shipment yet. Awaiting release from supplier. No revised ETA provided.",
    impactSeverity: "critical",
    affectedDepartments: ["Materials Management", "Emergency Department", "ICU", "Med/Surg"],
    inventoryImpact: "Normal Saline stock critically low across all departments. Current supply sustains operations for approximately 48 hours. This also impacts the 96-hour emergency readiness calculation (currently at 72 hours).",
    mitigationOptions: [
      "Place emergency order with Baxter International (backup contract) — 2-day expedited delivery, est. $9,800 (+$1,050 premium)",
      "Contact Fresenius Kabi account rep for production timeline update",
      "Implement IV fluid conservation protocol — restrict non-critical IV hydration orders",
      "Transfer 100 bags Normal Saline from Mount Zion campus (they have 30-day surplus)",
    ],
  },
  {
    id: "DEL-8899",
    poId: "PO-4518",
    supplier: "Halyard Health",
    carrier: "UPS Ground",
    items: [
      { name: "Sterile Surgical Gown (L)", qty: 400 },
      { name: "Sterile Surgical Gown (XL)", qty: 200 },
    ],
    totalCost: 4_050,
    originalEta: "2026-03-14",
    revisedEta: "2026-03-17",
    delayDays: 3,
    reason: "Weather-related carrier delay — severe storms in Southeast US disrupting UPS Ground network",
    carrierUpdate: "Package in transit. Cleared Memphis hub Mar 15 AM. Updated ETA: Mar 17.",
    impactSeverity: "medium",
    affectedDepartments: ["Operating Rooms", "Materials Management"],
    inventoryImpact: "Surgical Gown (L) at 540 units (PAR: 800). Sufficient for current OR schedule through Mar 19. If Mar 20 surgical volume spike proceeds as scheduled (18 cases), gowns may fall below minimum.",
    mitigationOptions: [
      "Monitor UPS tracking — likely to arrive Mar 17 as revised",
      "If Mar 17 delivery confirmed, no further action needed",
    ],
  },
];

// Activity feed
export const recentActivity = [
  { time: "08:45 AM", action: "Stock received", detail: "900 units of IV Catheter 20G — received at Parnassus Central Warehouse, distributed to ED Supply Room & Moffitt ICU", user: "M. Rodriguez" },
  { time: "08:30 AM", action: "AI Alert", detail: "Flu surge prediction — Bay Area outbreak intelligence", user: "System" },
  { time: "08:15 AM", action: "PM completed", detail: "Defibrillator LIFEPAK 20e — ED", user: "J. Chen" },
  { time: "07:50 AM", action: "Low stock alert", detail: "Vicryl 3-0 Sutures below reorder point — OR", user: "System" },
  { time: "07:30 AM", action: "Transfer completed", detail: "400 N95 Masks: Parnassus Warehouse → ED Supply Room & Mission Bay", user: "K. Patel" },
  { time: "07:00 AM", action: "Compliance scan", detail: "Daily TJC readiness check completed — Score: 88%", user: "System" },
  { time: "06:30 AM", action: "PO generated", detail: "Auto-generated PO #4521 for Heparin Sodium — Pfizer", user: "System" },
  { time: "06:00 AM", action: "Expiration alert", detail: "Propofol 200mg — 180 units expiring Jun 15, 2026", user: "System" },
  { time: "05:45 AM", action: "Pyxis replenishment", detail: "Pyxis replenishment completed — Moffitt ICU Pyxis #3, Mission Bay L&D Pyxis", user: "R. Nguyen" },
];

// ============================================================
// PAR Locations — Physical stocking points across the facility
// ============================================================

export type ParLocation = {
  id: string;
  name: string;
  floor: string;
  department: string;
  locationType: "warehouse" | "supply-room" | "adc" | "cart" | "sterile-core" | "satellite-pharmacy";
  adcModel?: string;
  managedBy: string;
  restockCycle: "daily" | "twice-daily" | "weekly" | "as-needed" | "shift-change";
  lastRestocked: string;
  itemCount: number;
  fillRate: number;
  status: "normal" | "low" | "critical" | "overstocked";
  supplyChain: "med-surg" | "pharmacy" | "surgical" | "lab" | "mixed";
};

export const parLocations: ParLocation[] = [
  // === Parnassus Heights Campus (Moffitt-Long) — ~80 PAR locations ===
  { id: "PAR-001", name: "Parnassus Central Warehouse", floor: "Basement", department: "Materials Management", locationType: "warehouse", managedBy: "Materials Management", restockCycle: "weekly", lastRestocked: "2026-03-15T06:00:00", itemCount: 5694, fillRate: 94, status: "normal", supplyChain: "mixed" },
  { id: "PAR-002", name: "Parnassus ED Supply Room", floor: "Moffitt 1st Floor", department: "Emergency Department", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:15:00", itemCount: 624, fillRate: 87, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-003", name: "ED Pyxis MedStation #1", floor: "Moffitt 1st Floor", department: "Emergency Department", locationType: "adc", adcModel: "Pyxis MedStation ES", managedBy: "Pharmacy", restockCycle: "twice-daily", lastRestocked: "2026-03-16T05:30:00", itemCount: 284, fillRate: 78, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-004", name: "ED Trauma Bay Supply", floor: "Moffitt 1st Floor", department: "Emergency Department", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "shift-change", lastRestocked: "2026-03-16T07:00:00", itemCount: 170, fillRate: 91, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-005", name: "Moffitt ICU Supply Room", floor: "Moffitt 8th Floor", department: "Intensive Care Unit", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-15T14:30:00", itemCount: 490, fillRate: 72, status: "low", supplyChain: "med-surg" },
  { id: "PAR-006", name: "ICU Pyxis MedStation #3", floor: "Moffitt 8th Floor", department: "Intensive Care Unit", locationType: "adc", adcModel: "Pyxis MedStation ES", managedBy: "Pharmacy", restockCycle: "twice-daily", lastRestocked: "2026-03-16T05:45:00", itemCount: 336, fillRate: 81, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-007", name: "Parnassus OR Supply Core", floor: "Long 3rd Floor", department: "Operating Rooms", locationType: "sterile-core", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-15T16:00:00", itemCount: 1782, fillRate: 79, status: "low", supplyChain: "surgical" },
  { id: "PAR-008", name: "OR Anesthesia Cart — Room 4", floor: "Long 3rd Floor", department: "Operating Rooms", locationType: "cart", managedBy: "Pharmacy", restockCycle: "shift-change", lastRestocked: "2026-03-15T19:00:00", itemCount: 96, fillRate: 65, status: "critical", supplyChain: "pharmacy" },
  { id: "PAR-009", name: "Med/Surg Long 11th Supply", floor: "Long 11th Floor", department: "Med/Surg", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:30:00", itemCount: 396, fillRate: 106, status: "overstocked", supplyChain: "med-surg" },
  { id: "PAR-010", name: "Med/Surg Long 14th Supply", floor: "Long 14th Floor", department: "Med/Surg", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:45:00", itemCount: 408, fillRate: 82, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-011", name: "Med/Surg Long 14th Omnicell", floor: "Long 14th Floor", department: "Med/Surg", locationType: "adc", adcModel: "Omnicell XT", managedBy: "Pharmacy", restockCycle: "twice-daily", lastRestocked: "2026-03-16T05:50:00", itemCount: 268, fillRate: 88, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-012", name: "Pharmacy — Parnassus Main", floor: "Moffitt 1st Floor", department: "Pharmacy", locationType: "satellite-pharmacy", managedBy: "Pharmacy", restockCycle: "as-needed", lastRestocked: "2026-03-15T22:00:00", itemCount: 2490, fillRate: 91, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-013", name: "Pharmacy — Controlled Substance Vault", floor: "Moffitt 1st Floor", department: "Pharmacy", locationType: "satellite-pharmacy", managedBy: "Pharmacy", restockCycle: "as-needed", lastRestocked: "2026-03-15T20:00:00", itemCount: 174, fillRate: 95, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-014", name: "Satellite Pharmacy — Moffitt ICU", floor: "Moffitt 8th Floor", department: "Pharmacy", locationType: "satellite-pharmacy", managedBy: "Pharmacy", restockCycle: "daily", lastRestocked: "2026-03-16T06:00:00", itemCount: 468, fillRate: 83, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-015", name: "Lab Supply Room — Parnassus", floor: "Moffitt 1st Floor", department: "Laboratory", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "weekly", lastRestocked: "2026-03-15T10:00:00", itemCount: 734, fillRate: 96, status: "normal", supplyChain: "lab" },
  { id: "PAR-016", name: "Lab — Blood Bank", floor: "Moffitt 1st Floor", department: "Laboratory", locationType: "supply-room", managedBy: "Laboratory", restockCycle: "weekly", lastRestocked: "2026-03-15T10:30:00", itemCount: 290, fillRate: 92, status: "normal", supplyChain: "lab" },
  { id: "PAR-017", name: "SPD — Sterile Processing", floor: "Basement", department: "Materials Management", locationType: "sterile-core", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T05:00:00", itemCount: 846, fillRate: 88, status: "normal", supplyChain: "surgical" },
  { id: "PAR-018", name: "Isolation Cart — Long 11th", floor: "Long 11th Floor", department: "Med/Surg", locationType: "cart", managedBy: "Materials Management", restockCycle: "shift-change", lastRestocked: "2026-03-15T19:00:00", itemCount: 68, fillRate: 45, status: "critical", supplyChain: "med-surg" },
  { id: "PAR-019", name: "Transplant Supply Room", floor: "Long 15th Floor", department: "Transplant Services", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:10:00", itemCount: 312, fillRate: 89, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-020", name: "Neuro ICU Supply Room", floor: "Moffitt 7th Floor", department: "Neurosciences", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:05:00", itemCount: 278, fillRate: 84, status: "normal", supplyChain: "med-surg" },

  // === Mission Bay Campus — ~35 PAR locations ===
  { id: "PAR-021", name: "Mission Bay L&D Supply Room", floor: "Mission Bay 4th Floor", department: "Labor & Delivery", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:20:00", itemCount: 312, fillRate: 93, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-022", name: "Mission Bay L&D Pyxis", floor: "Mission Bay 4th Floor", department: "Labor & Delivery", locationType: "adc", adcModel: "Pyxis MedStation ES", managedBy: "Pharmacy", restockCycle: "twice-daily", lastRestocked: "2026-03-16T05:40:00", itemCount: 196, fillRate: 85, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-023", name: "Mission Bay NICU Supply", floor: "Mission Bay 3rd Floor", department: "Intensive Care Unit", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:25:00", itemCount: 345, fillRate: 91, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-024", name: "Mission Bay Central Supply", floor: "Mission Bay 1st Floor", department: "Materials Management", locationType: "warehouse", managedBy: "Materials Management", restockCycle: "weekly", lastRestocked: "2026-03-15T07:00:00", itemCount: 1842, fillRate: 90, status: "normal", supplyChain: "mixed" },
  { id: "PAR-025", name: "Benioff SF Pharmacy", floor: "Mission Bay 2nd Floor", department: "Pharmacy", locationType: "satellite-pharmacy", managedBy: "Pharmacy", restockCycle: "daily", lastRestocked: "2026-03-16T06:00:00", itemCount: 856, fillRate: 87, status: "normal", supplyChain: "pharmacy" },
  { id: "PAR-026", name: "Mission Bay Oncology Supply", floor: "Mission Bay 5th Floor", department: "Oncology / Cancer Center", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:30:00", itemCount: 267, fillRate: 92, status: "normal", supplyChain: "med-surg" },

  // === Mount Zion Campus — ~18 PAR locations ===
  { id: "PAR-027", name: "Mount Zion Supply Room", floor: "Mount Zion 2nd Floor", department: "Materials Management", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:15:00", itemCount: 423, fillRate: 88, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-028", name: "Mount Zion OR Supply Core", floor: "Mount Zion 3rd Floor", department: "Operating Rooms", locationType: "sterile-core", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T05:45:00", itemCount: 612, fillRate: 82, status: "normal", supplyChain: "surgical" },
  { id: "PAR-029", name: "Mount Zion Pharmacy", floor: "Mount Zion 1st Floor", department: "Pharmacy", locationType: "satellite-pharmacy", managedBy: "Pharmacy", restockCycle: "daily", lastRestocked: "2026-03-16T06:00:00", itemCount: 534, fillRate: 90, status: "normal", supplyChain: "pharmacy" },

  // === Benioff Children's Oakland — ~15 PAR locations ===
  { id: "PAR-030", name: "Oakland Central Supply", floor: "Oakland Main 1st Floor", department: "Materials Management", locationType: "warehouse", managedBy: "Materials Management", restockCycle: "weekly", lastRestocked: "2026-03-15T06:30:00", itemCount: 1456, fillRate: 91, status: "normal", supplyChain: "mixed" },
  { id: "PAR-031", name: "Oakland Pediatric ICU Supply", floor: "Oakland Main 4th Floor", department: "Intensive Care Unit", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:10:00", itemCount: 287, fillRate: 86, status: "normal", supplyChain: "med-surg" },
  { id: "PAR-032", name: "Oakland ED Supply Room", floor: "Oakland Main 1st Floor", department: "Emergency Department", locationType: "supply-room", managedBy: "Materials Management", restockCycle: "daily", lastRestocked: "2026-03-16T06:20:00", itemCount: 345, fillRate: 83, status: "normal", supplyChain: "med-surg" },
];

// ============================================================
// Surgeon Preference Cards
// ============================================================

export type PreferenceCard = {
  id: string;
  surgeon: string;
  credentials: string;
  specialty: string;
  procedure: string;
  supplies: { item: string; qty: number; unitCost: number; required: boolean }[];
  implants?: { item: string; vendor: string; rep: string; consignment: boolean; estimatedCost: number }[];
  lastUpdated: string;
  casesLast90Days: number;
};

export const preferenceCards: PreferenceCard[] = [
  {
    id: "PREF-001",
    surgeon: "Dr. Nakamura",
    credentials: "MD, FAAOS",
    specialty: "Orthopedic Surgery",
    procedure: "Total Knee",
    supplies: [
      { item: "Surgical Drape Kit — Total Knee", qty: 1, unitCost: 34.00, required: true },
      { item: "Vicryl 3-0 Suture", qty: 4, unitCost: 9.80, required: true },
      { item: "Bone Cement 40g", qty: 1, unitCost: 45.00, required: true },
      { item: "Sterile Surgical Gown (L)", qty: 3, unitCost: 6.75, required: true },
      { item: "Nitrile Gloves (pair)", qty: 10, unitCost: 0.24, required: true },
      { item: "Hemovac Drain", qty: 1, unitCost: 22.00, required: false },
    ],
    implants: [
      { item: "Zimmer Biomet NexGen Total Knee System", vendor: "Zimmer Biomet", rep: "Mike Torres", consignment: true, estimatedCost: 4200 },
    ],
    lastUpdated: "2026-02-18",
    casesLast90Days: 22,
  },
  {
    id: "PREF-002",
    surgeon: "Dr. Patel",
    credentials: "MD, FAAOS",
    specialty: "Orthopedic Surgery",
    procedure: "Total Knee",
    supplies: [
      { item: "Surgical Drape Kit — Total Knee", qty: 1, unitCost: 34.00, required: true },
      { item: "Vicryl 3-0 Suture", qty: 2, unitCost: 9.80, required: true },
      { item: "Monocryl 3-0 Suture", qty: 2, unitCost: 11.50, required: true },
      { item: "Bone Cement 40g", qty: 1, unitCost: 45.00, required: true },
      { item: "Sterile Surgical Gown (L)", qty: 3, unitCost: 6.75, required: true },
      { item: "Nitrile Gloves (pair)", qty: 8, unitCost: 0.24, required: true },
    ],
    implants: [
      { item: "Stryker Mako Total Knee System", vendor: "Stryker", rep: "Sarah Lin", consignment: true, estimatedCost: 5100 },
    ],
    lastUpdated: "2026-03-01",
    casesLast90Days: 18,
  },
  {
    id: "PREF-003",
    surgeon: "Dr. Patel",
    credentials: "MD, FAAOS",
    specialty: "Orthopedic Surgery",
    procedure: "Hip Replacement",
    supplies: [
      { item: "Surgical Drape Kit — Hip", qty: 1, unitCost: 38.00, required: true },
      { item: "Vicryl 3-0 Suture", qty: 3, unitCost: 9.80, required: true },
      { item: "Bone Cement 40g", qty: 2, unitCost: 45.00, required: true },
      { item: "Sterile Surgical Gown (L)", qty: 4, unitCost: 6.75, required: true },
      { item: "Hemovac Drain", qty: 1, unitCost: 22.00, required: true },
      { item: "Nitrile Gloves (pair)", qty: 10, unitCost: 0.24, required: true },
    ],
    implants: [
      { item: "DePuy Synthes Corail Hip System", vendor: "DePuy Synthes", rep: "James Ito", consignment: true, estimatedCost: 6800 },
    ],
    lastUpdated: "2026-02-25",
    casesLast90Days: 14,
  },
  {
    id: "PREF-004",
    surgeon: "Dr. Vasquez",
    credentials: "MD, FACS",
    specialty: "Neurosurgery / Spine",
    procedure: "Spinal Fusion",
    supplies: [
      { item: "Spinal Drape Kit", qty: 1, unitCost: 42.00, required: true },
      { item: "Vicryl 3-0 Suture", qty: 4, unitCost: 9.80, required: true },
      { item: "Bone Graft Substitute 10cc", qty: 2, unitCost: 320.00, required: true },
      { item: "Sterile Surgical Gown (L)", qty: 4, unitCost: 6.75, required: true },
      { item: "Hemovac Drain", qty: 1, unitCost: 22.00, required: true },
      { item: "Nitrile Gloves (pair)", qty: 12, unitCost: 0.24, required: true },
      { item: "Cell Saver Tubing Set", qty: 1, unitCost: 85.00, required: false },
    ],
    implants: [
      { item: "Medtronic CD Horizon Spinal System", vendor: "Medtronic", rep: "David Park", consignment: true, estimatedCost: 12400 },
    ],
    lastUpdated: "2026-03-05",
    casesLast90Days: 11,
  },
  {
    id: "PREF-005",
    surgeon: "Dr. Chen",
    credentials: "MD, FACOG",
    specialty: "Obstetrics & Gynecology",
    procedure: "C-Section",
    supplies: [
      { item: "C-Section Drape Kit", qty: 1, unitCost: 32.00, required: true },
      { item: "Vicryl 3-0 Suture", qty: 2, unitCost: 9.80, required: true },
      { item: "Sterile Surgical Gown (L)", qty: 3, unitCost: 6.75, required: true },
      { item: "Oxytocin 10U/mL", qty: 2, unitCost: 5.60, required: true },
      { item: "Infant Warmer Liner", qty: 1, unitCost: 8.50, required: true },
      { item: "Nitrile Gloves (pair)", qty: 8, unitCost: 0.24, required: true },
    ],
    lastUpdated: "2026-01-20",
    casesLast90Days: 31,
  },
  {
    id: "PREF-006",
    surgeon: "Dr. Nakamura",
    credentials: "MD, FAAOS",
    specialty: "Orthopedic Surgery",
    procedure: "Hip Replacement",
    supplies: [
      { item: "Surgical Drape Kit — Hip", qty: 1, unitCost: 38.00, required: true },
      { item: "Vicryl 3-0 Suture", qty: 3, unitCost: 9.80, required: true },
      { item: "Bone Cement 40g", qty: 2, unitCost: 45.00, required: true },
      { item: "Sterile Surgical Gown (L)", qty: 4, unitCost: 6.75, required: true },
      { item: "Hemovac Drain", qty: 1, unitCost: 22.00, required: true },
      { item: "Nitrile Gloves (pair)", qty: 10, unitCost: 0.24, required: true },
    ],
    implants: [
      { item: "Zimmer Biomet Taperloc Hip Stem", vendor: "Zimmer Biomet", rep: "Mike Torres", consignment: true, estimatedCost: 5900 },
    ],
    lastUpdated: "2026-02-10",
    casesLast90Days: 16,
  },
];

// ============================================================
// Cross-Location Imbalances
// ============================================================

export type LocationImbalance = {
  itemId: string;
  itemName: string;
  locations: { locationName: string; currentQty: number; parLevel: number; pctOfPar: number; status: "overstocked" | "at-par" | "below-par" | "critical" | "stockout" }[];
  suggestedTransfer: { from: string; to: string; qty: number; reason: string };
};

export const locationImbalances: LocationImbalance[] = [
  {
    itemId: "INV-001",
    itemName: "Nitrile Examination Gloves (M)",
    locations: [
      { locationName: "Med/Surg Long 11th Supply", currentQty: 3600, parLevel: 2000, pctOfPar: 180, status: "overstocked" },
      { locationName: "Moffitt ICU Supply Room", currentQty: 672, parLevel: 1600, pctOfPar: 42, status: "critical" },
      { locationName: "Parnassus ED Supply Room", currentQty: 2400, parLevel: 2400, pctOfPar: 100, status: "at-par" },
      { locationName: "Parnassus Central Warehouse", currentQty: 12000, parLevel: 14000, pctOfPar: 86, status: "below-par" },
    ],
    suggestedTransfer: { from: "Med/Surg Long 11th Supply", to: "Moffitt ICU Supply Room", qty: 800, reason: "ICU at 42% of PAR while Med/Surg Long 11th is overstocked at 180% — likely hoarding after flu surge alert" },
  },
  {
    itemId: "INV-006",
    itemName: "Heparin Sodium 5000U/mL",
    locations: [
      { locationName: "Pharmacy — Parnassus Main", currentQty: 50, parLevel: 120, pctOfPar: 42, status: "below-par" },
      { locationName: "ICU Pyxis MedStation #3", currentQty: 16, parLevel: 40, pctOfPar: 40, status: "critical" },
      { locationName: "Med/Surg Long 14th Omnicell", currentQty: 10, parLevel: 30, pctOfPar: 33, status: "critical" },
      { locationName: "ED Pyxis MedStation #1", currentQty: 14, parLevel: 30, pctOfPar: 47, status: "below-par" },
    ],
    suggestedTransfer: { from: "Pharmacy — Parnassus Main", to: "ICU Pyxis MedStation #3", qty: 24, reason: "ICU Pyxis below ADC par of 40 — redistribute from Pharmacy pending PO-4521 arrival (ETA Mar 20)" },
  },
  {
    itemId: "INV-002",
    itemName: "N95 Respirator Masks",
    locations: [
      { locationName: "Parnassus ED Supply Room", currentQty: 1000, parLevel: 1000, pctOfPar: 100, status: "at-par" },
      { locationName: "Isolation Cart — Long 11th", currentQty: 36, parLevel: 80, pctOfPar: 45, status: "critical" },
      { locationName: "Parnassus Central Warehouse", currentQty: 3000, parLevel: 4000, pctOfPar: 75, status: "below-par" },
      { locationName: "Moffitt ICU Supply Room", currentQty: 600, parLevel: 700, pctOfPar: 86, status: "below-par" },
    ],
    suggestedTransfer: { from: "Parnassus ED Supply Room", to: "Isolation Cart — Long 11th", qty: 40, reason: "Isolation Cart at 45% of PAR — compliance finding FND-005 requires 48-hour coverage. Transfer 40 from ED (at full PAR) to close gap" },
  },
  {
    itemId: "INV-004",
    itemName: "Propofol 200mg/20mL",
    locations: [
      { locationName: "OR Anesthesia Cart — Room 4", currentQty: 80, parLevel: 40, pctOfPar: 200, status: "overstocked" },
      { locationName: "ED Pyxis MedStation #1", currentQty: 10, parLevel: 40, pctOfPar: 25, status: "critical" },
      { locationName: "Pharmacy — Parnassus Main", currentQty: 240, parLevel: 240, pctOfPar: 100, status: "at-par" },
      { locationName: "ICU Pyxis MedStation #3", currentQty: 30, parLevel: 40, pctOfPar: 75, status: "below-par" },
    ],
    suggestedTransfer: { from: "OR Anesthesia Cart — Room 4", to: "ED Pyxis MedStation #1", qty: 20, reason: "OR Anesthesia at 200% of typical par while ED Pyxis critically low at 25% — rebalance to avoid ED procedural sedation delays" },
  },
];
