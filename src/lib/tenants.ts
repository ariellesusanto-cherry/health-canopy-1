export type TenantId = "contra-costa";

export type TenantSite = {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "specialty";
  city: string;
  /** Rollout state — "live" sites stream data today; "onboarding" sites are
   *  in the deployment pipeline (shown greyed in cross-site views). */
  status?: "live" | "onboarding";
};

export type TenantMetrics = {
  totalSKUs: string;
  skuChange: string;
  parLocationCount: string;
  parLocationContext: string;
  activeAlerts: string;
  alertsContext: string;
  monthlySpend: string;
  spendChange: string;
};

export type SupplyChainRow = {
  chain: string;
  fill: number;
  locations: number;
  status: "normal" | "low" | "critical";
};

export type AnalyticsMetrics = {
  monthlySpend: string;
  monthlySpendBudget: string;
  monthlySpendChange: string;
  inventoryTurnover: string;
  inventoryTurnoverChange: string;
  leadTime: string;
  leadTimeChange: string;
  fillRate: string;
  fillRateChange: string;
  wasteExpiration: string;
  wasteExpirationChange: string;
  activeVendors: string;
  activeVendorsContext: string;
};

export type SiteInventoryBreakdown = {
  siteId: string;
  siteName: string;
  type: "hospital" | "clinic" | "specialty";
  totalItems: number;
  parLocations: number;
  vfcFridges: number;
  privateFridges: number;
  criticalAlerts: number;
  expiringSoon: number;
};

export type InventoryBreakdown = {
  total: number;
  inStock: number;
  lowStock: number;
  critical: number;
  expiring: number;
};

export type ForecastingOverview = {
  predictedDailyConsumption: string;
  predictedDailyContext: string;
  predictedDailyChange: string;
  outbreakRisk: "HIGH" | "MEDIUM" | "LOW";
  outbreakNote: string;
  monthlyForecast: string;
  monthlyForecastNote: string;
};

export type TenantSurgeInsight = {
  id: string;
  type: "outbreak";
  severity: "high";
  title: string;
  description: string;
  timestamp: string;
  actionable: true;
  suggestedAction: string;
  impact: string;
};

export type ColdChainFridge = {
  type: "VFC" | "Private";
  tempF: number;
  status: "normal" | "alert" | "excursion";
  doseCount: number;
  lotCount: number;
};

export type ColdChainSite = {
  siteId: string;
  siteName: string;
  fridges: ColdChainFridge[];
};

export type VfcCompliance = {
  providerOfRecord: string;
  vaccineCoordinator: string;
  backupCoordinator: string;
  lastSiteVisit: string;
  lastSiteVisitResult: "passed" | "follow-up" | "pending";
  nextRecertificationDays: number;
  iqipVisit: string;
  excursions24h: number;
  cair2PendingDoses: number;
  registry: string;
};

export type VfcScanEvent = {
  timestamp: string;
  vaccine: string;
  brand: string;
  fridge: "VFC" | "Private";
  site: string;
  patientId: string;
  registrySubmitted: boolean;
  // Barcode payload (encoded in the 2D Data Matrix on the vial)
  ndc: string;
  lot: string;
  expiration: string;
  // Patient + clinical context
  patientAge: string;
  eligibility:
    | "Medicaid"
    | "Uninsured"
    | "Underinsured"
    | "AI/AN"
    | "Private Insurance";
  visVersion: string;
  scannedBy: string;
  room: string;
  // Downstream system fan-out
  ehrSystem: string;
  ehrPosted: boolean;
  ehrPostedAt?: string;
  cair2Submitted: boolean;
  cair2SubmittedAt?: string;
  inventoryDecremented: boolean;
  myCAVaxLogged: boolean;
  auditTrailCaptured: boolean;
};

export type VfcContact = {
  role: string;
  name: string;
  title: string;
  phone: string;
  email: string;
};

export type VfcContacts = {
  practice: VfcContact[];
  emergency: VfcContact[];
};

export type VfcEquipmentUnit = {
  unitId: string;
  type: "Refrigerator" | "Freezer" | "ULT Freezer";
  locationId: string;
  siteName: string;
  designation: "primary" | "backup";
  serialNumber: string;
  dataLoggerModel: string;
  dataLoggerSerial: string;
  probeType: "swappable" | "fixed";
  calibrationExpires: string;
  alarmLowF: number;
  alarmHighF: number;
};

export type VfcRoleProfile = {
  role: string;
  name: string;
  credential: string;
  trainingComplete: boolean;
  trainingDate: string;
  responsibilities: string[];
};

export type VfcTask = {
  cadence: "daily" | "bi-weekly" | "monthly" | "annual" | "as-needed";
  title: string;
  description: string;
  status: "on-track" | "due-soon" | "overdue" | "complete";
  lastCompleted?: string;
  nextDue?: string;
};

export type TenantLocationImbalance = {
  itemId: string;
  itemName: string;
  fromLocation: string;
  fromPctOfPar: number;
  toLocation: string;
  toPctOfPar: number;
  suggestedQty: number;
  reason?: string;
};

export type AttentionItem = {
  id: string;
  name: string;
  department: string;
  status: "critical" | "out-of-stock" | "expiring-soon";
  currentStock: number;
  parLevel: number;
  expirationDate?: string;
  fridge?: "VFC" | "Private";
  site?: string;
  action?: string;
};

export type VfcSEWEvent = {
  id: string;
  date: string;
  category: "spoiled" | "expired" | "wasted";
  vaccine: string;
  brand: string;
  lot: string;
  doses: number;
  reason: string;
  reportedToMyCAVax: boolean;
  disposalStatus: "pending" | "completed";
};

export type Tenant = {
  id: TenantId;
  name: string;
  shortName: string;
  abbreviation: string;
  system: string;
  primarySite: string;
  dashboardSubtitle: string;
  inventorySubtitle: string;
  campusCount: number;
  campusLabel: string;
  sites: TenantSite[];
  metrics: TenantMetrics;
  supplyChains: SupplyChainRow[];
  region: string;
  county: string;
  localHealthDept: string;
  transferSourceLocation: string;
  surgeScenarioTitle: string;
  surgeScenarioDesc: string;
  surgeInsight: TenantSurgeInsight;
  coldChain: ColdChainSite[];
  vfcCompliance: VfcCompliance;
  vfcScans: VfcScanEvent[];
  vfcContacts: VfcContacts;
  vfcEquipment: VfcEquipmentUnit[];
  vfcRoles: VfcRoleProfile[];
  vfcTasks: VfcTask[];
  vfcSEW: VfcSEWEvent[];
  itemsNeedingAttention: AttentionItem[];
  locationImbalances: TenantLocationImbalance[];
  analyticsMetrics: AnalyticsMetrics;
  forecastingOverview: ForecastingOverview;
  inventoryBreakdown: InventoryBreakdown;
  sitesInventory: SiteInventoryBreakdown[];
  /** Scale factor for derived totals (annual budget, YTD spend, inventory value) relative to a full academic-medical-center baseline of 1.0. */
  financialScale: number;
};

export const tenants: Record<TenantId, Tenant> = {
  "contra-costa": {
    id: "contra-costa",
    name: "Contra Costa Health",
    shortName: "Contra Costa",
    abbreviation: "CC",
    system: "Contra Costa Health Services",
    primarySite: "Contra Costa Regional Medical Center",
    dashboardSubtitle:
      "Contra Costa Regional Medical Center — Martinez, CA — Real-time supply chain status",
    inventorySubtitle:
      "Real-time stock tracking across CCRMC and the Martinez clinics",
    campusCount: 3,
    campusLabel: "sites",
    sites: [
      { id: "ccrmc", name: "Contra Costa Regional Medical Center", type: "hospital", city: "Martinez, CA", status: "live" },
      { id: "martinez-health", name: "Martinez Health Center", type: "clinic", city: "Martinez, CA", status: "live" },
      { id: "martinez-wellness", name: "Martinez Wellness Center", type: "clinic", city: "Martinez, CA", status: "live" },
      // Remaining Contra Costa Health outpatient centers — onboarding wave 2
      { id: "antioch", name: "Antioch Health Center", type: "clinic", city: "Antioch, CA", status: "onboarding" },
      { id: "pittsburg", name: "Pittsburg Health Center", type: "clinic", city: "Pittsburg, CA", status: "onboarding" },
      { id: "concord", name: "Concord Health Center", type: "clinic", city: "Concord, CA", status: "onboarding" },
      { id: "west-county", name: "West County Health Center", type: "clinic", city: "San Pablo, CA", status: "onboarding" },
      { id: "brentwood", name: "Brentwood Health Center", type: "clinic", city: "Brentwood, CA", status: "onboarding" },
      { id: "north-richmond", name: "North Richmond Center for Health", type: "clinic", city: "Richmond, CA", status: "onboarding" },
      { id: "bay-point", name: "Bay Point Family Health Center", type: "clinic", city: "Bay Point, CA", status: "onboarding" },
    ],
    metrics: {
      totalSKUs: "18,470",
      skuChange: "+38 this month",
      parLocationCount: "34",
      parLocationContext: "3 live sites · 7 onboarding",
      activeAlerts: "6",
      alertsContext: "1 critical",
      monthlySpend: "$842K",
      spendChange: "-3.2% vs budget",
    },
    analyticsMetrics: {
      monthlySpend: "$842K",
      monthlySpendBudget: "vs. $870K budget",
      monthlySpendChange: "-3.2%",
      inventoryTurnover: "10.4x",
      inventoryTurnoverChange: "+0.3",
      leadTime: "4.1 days",
      leadTimeChange: "-0.2",
      fillRate: "94.2%",
      fillRateChange: "+0.8%",
      wasteExpiration: "$28K",
      wasteExpirationChange: "-9%",
      activeVendors: "11",
      activeVendorsContext: "2 underperforming",
    },
    forecastingOverview: {
      predictedDailyConsumption: "1,072",
      predictedDailyContext: "items/day by Mar 29",
      predictedDailyChange: "+12% vs. current average",
      outbreakRisk: "HIGH",
      outbreakNote: "Respiratory surge — 30-50% ED increase predicted",
      monthlyForecast: "$927K",
      monthlyForecastNote: "$32K over budget — respiratory surge",
    },
    financialScale: 0.328,
    inventoryBreakdown: {
      total: 18470,
      inStock: 17094,
      lowStock: 823,
      critical: 379,
      expiring: 174,
    },
    sitesInventory: [
      { siteId: "ccrmc", siteName: "Contra Costa Regional Medical Center", type: "hospital", totalItems: 14200, parLocations: 22, vfcFridges: 1, privateFridges: 1, criticalAlerts: 4, expiringSoon: 102 },
      { siteId: "martinez-health", siteName: "Martinez Health Center", type: "clinic", totalItems: 2850, parLocations: 7, vfcFridges: 1, privateFridges: 1, criticalAlerts: 1, expiringSoon: 47 },
      { siteId: "martinez-wellness", siteName: "Martinez Wellness Center", type: "clinic", totalItems: 1420, parLocations: 5, vfcFridges: 1, privateFridges: 1, criticalAlerts: 1, expiringSoon: 25 },
    ],
    supplyChains: [
      { chain: "Med/Surg", fill: 88, locations: 17, status: "normal" },
      { chain: "Pharmacy & ADC", fill: 81, locations: 8, status: "low" },
      { chain: "Surgical / OR", fill: 74, locations: 5, status: "critical" },
      { chain: "Laboratory", fill: 94, locations: 4, status: "normal" },
    ],
    region: "East Bay",
    county: "Contra Costa County",
    localHealthDept: "Contra Costa Public Health",
    transferSourceLocation: "Martinez Health Center",
    surgeScenarioTitle: "Respiratory Surge Hits Contra Costa County",
    surgeScenarioDesc:
      "What if CCRMC ED respiratory visits increase 35% over the next 10 days?",
    surgeInsight: {
      id: "AI-001",
      type: "outbreak",
      severity: "high",
      title: "Respiratory Surge Predicted — Contra Costa County",
      description:
        "Contra Costa Public Health surveillance shows 28% week-over-week increase in respiratory illness across the county, with East County (Antioch, Pittsburg, Brentwood) reporting the highest case rates. Wastewater data from Central Contra Costa Sanitary District confirms rising viral load. Flu vaccination bookings at Martinez Health Center are up 4x month-over-month. Model predicts 30-50% increase in respiratory visits at CCRMC ED within 7-10 days.",
      timestamp: "2026-03-16T08:30:00",
      actionable: true,
      suggestedAction:
        "Pre-order flu vaccine doses (est. 80 units split across CCRMC + the two Martinez clinics), Tamiflu (est. 120 units), rapid flu tests (est. 600 units), N95 masks (est. 1,200 units), and vaccination supplies (syringes, alcohol pads). Auto-adjust PAR levels for respiratory supplies at all 3 Martinez sites.",
      impact: "Prevents estimated $18,000 in emergency procurement costs",
    },
    coldChain: [
      {
        siteId: "ccrmc",
        siteName: "Contra Costa Regional Medical Center",
        fridges: [
          { type: "VFC", tempF: 40, status: "normal", doseCount: 412, lotCount: 18 },
          { type: "Private", tempF: 39, status: "normal", doseCount: 287, lotCount: 12 },
        ],
      },
      {
        siteId: "martinez-health",
        siteName: "Martinez Health Center",
        fridges: [
          { type: "VFC", tempF: 41, status: "normal", doseCount: 256, lotCount: 14 },
          { type: "Private", tempF: 40, status: "normal", doseCount: 142, lotCount: 9 },
        ],
      },
      {
        siteId: "martinez-wellness",
        siteName: "Martinez Wellness Center",
        fridges: [
          { type: "VFC", tempF: 43, status: "alert", doseCount: 198, lotCount: 11 },
          { type: "Private", tempF: 38, status: "normal", doseCount: 89, lotCount: 7 },
        ],
      },
    ],
    vfcCompliance: {
      providerOfRecord: "Dr. R. Alvarez, MD",
      vaccineCoordinator: "Maria Gutierrez, RN",
      backupCoordinator: "Tyler Nguyen, MA",
      lastSiteVisit: "2026-03-08",
      lastSiteVisitResult: "passed",
      nextRecertificationDays: 47,
      iqipVisit: "2026-05-12",
      excursions24h: 0,
      cair2PendingDoses: 3,
      registry: "CAIR2",
    },
    vfcScans: [
      {
        timestamp: "2026-03-16T11:48:00",
        vaccine: "DTaP", brand: "Daptacel", fridge: "VFC",
        site: "Martinez Health Center", patientId: "CC-247831",
        registrySubmitted: true,
        ndc: "49281-0286-58", lot: "C7245AB", expiration: "2027-04-30",
        patientAge: "4y", eligibility: "Medicaid", visVersion: "DTaP VIS 08/06/2025",
        scannedBy: "RN M. Gutierrez", room: "MHC Exam 4",
        ehrSystem: "ccLink (Epic)",
        ehrPosted: true, ehrPostedAt: "2026-03-16T11:48:11",
        cair2Submitted: true, cair2SubmittedAt: "2026-03-16T11:49:00",
        inventoryDecremented: true, myCAVaxLogged: true, auditTrailCaptured: true,
      },
      {
        timestamp: "2026-03-16T11:22:00",
        vaccine: "Hep B (Pediatric)", brand: "Engerix-B", fridge: "VFC",
        site: "CCRMC — Pediatrics", patientId: "CC-247824",
        registrySubmitted: true,
        ndc: "58160-0820-11", lot: "HB-0918-D", expiration: "2026-05-08",
        patientAge: "2mo", eligibility: "Medicaid", visVersion: "Hep B VIS 08/06/2025",
        scannedBy: "RN S. Okafor", room: "Peds Clinic Rm 2",
        ehrSystem: "ccLink (Epic)",
        ehrPosted: true, ehrPostedAt: "2026-03-16T11:22:08",
        cair2Submitted: true, cair2SubmittedAt: "2026-03-16T11:22:54",
        inventoryDecremented: true, myCAVaxLogged: true, auditTrailCaptured: true,
      },
      {
        timestamp: "2026-03-16T10:47:00",
        vaccine: "MMR", brand: "M-M-R II", fridge: "VFC",
        site: "Martinez Wellness Center", patientId: "CC-247811",
        registrySubmitted: false,
        ndc: "00006-4681-00", lot: "MR-1198-A", expiration: "2026-04-18",
        patientAge: "15mo", eligibility: "Uninsured", visVersion: "MMR VIS 08/06/2025",
        scannedBy: "MA T. Nguyen", room: "MWC Vaccine Rm",
        ehrSystem: "ccLink (Epic)",
        ehrPosted: true, ehrPostedAt: "2026-03-16T10:47:09",
        cair2Submitted: false,
        inventoryDecremented: true, myCAVaxLogged: true, auditTrailCaptured: true,
      },
      {
        timestamp: "2026-03-16T10:12:00",
        vaccine: "Tdap", brand: "Adacel", fridge: "Private",
        site: "Martinez Health Center", patientId: "CC-247797",
        registrySubmitted: true,
        ndc: "49281-0400-15", lot: "AD-0274-B", expiration: "2026-04-26",
        patientAge: "11y", eligibility: "Private Insurance", visVersion: "Td/Tdap VIS 08/06/2025",
        scannedBy: "RN M. Gutierrez", room: "MHC Exam 2",
        ehrSystem: "ccLink (Epic)",
        ehrPosted: true, ehrPostedAt: "2026-03-16T10:12:13",
        cair2Submitted: true, cair2SubmittedAt: "2026-03-16T10:13:01",
        inventoryDecremented: true, myCAVaxLogged: true, auditTrailCaptured: true,
      },
    ],
    vfcContacts: {
      practice: [
        { role: "Provider of Record", name: "Dr. R. Alvarez", title: "Pediatrics Medical Director, MD", phone: "(925) 370-5000", email: "r.alvarez@cchealth.org" },
        { role: "Provider of Record Designee", name: "Dr. K. Singh", title: "Family Medicine Lead, MD", phone: "(925) 370-5012", email: "k.singh@cchealth.org" },
        { role: "Vaccine Coordinator", name: "Maria Gutierrez", title: "Immunization Coordinator, RN", phone: "(925) 370-5188", email: "m.gutierrez@cchealth.org" },
        { role: "Backup Vaccine Coordinator", name: "Tyler Nguyen", title: "Pediatric MA", phone: "(925) 370-5189", email: "t.nguyen@cchealth.org" },
      ],
      emergency: [
        { role: "CDPH Field Representative", name: "Renee Sato", title: "CDPH IZ Branch (Bay Area region)", phone: "(916) 558-1746", email: "renee.sato@cdph.ca.gov" },
        { role: "VFC Program Representative", name: "MyCAVax Support", title: "VFC Customer Service", phone: "(877) 243-8832", email: "MyVFCvaccines@cdph.ca.gov" },
        { role: "Building Maintenance", name: "CCRMC Facilities", title: "24/7 work order line", phone: "(925) 370-5400", email: "facilities@cchealth.org" },
        { role: "Refrigerator Repair", name: "Follett Service", title: "Authorized vendor", phone: "(800) 523-9361", email: "service@follettice.com" },
      ],
    },
    vfcEquipment: [
      { unitId: "VFC-FR-CCRMC-01", type: "Refrigerator", locationId: "CCRMC · Peds Clinic Room 2", siteName: "Contra Costa Regional Medical Center", designation: "primary", serialNumber: "FF-2C-44012", dataLoggerModel: "LogTag UTRIX-16", dataLoggerSerial: "LT-88112", probeType: "swappable", calibrationExpires: "2026-09-30", alarmLowF: 36, alarmHighF: 46 },
      { unitId: "PRIV-FR-CCRMC-01", type: "Refrigerator", locationId: "CCRMC · Peds Clinic Room 2", siteName: "Contra Costa Regional Medical Center", designation: "primary", serialNumber: "FF-2C-44013", dataLoggerModel: "LogTag UTRIX-16", dataLoggerSerial: "LT-88113", probeType: "swappable", calibrationExpires: "2026-09-30", alarmLowF: 36, alarmHighF: 46 },
      { unitId: "VFC-FR-MHC-01", type: "Refrigerator", locationId: "Martinez Health Center · Immunization Bay", siteName: "Martinez Health Center", designation: "primary", serialNumber: "FF-2C-44128", dataLoggerModel: "LogTag UTRIX-16", dataLoggerSerial: "LT-88204", probeType: "swappable", calibrationExpires: "2026-10-18", alarmLowF: 36, alarmHighF: 46 },
      { unitId: "PRIV-FR-MHC-01", type: "Refrigerator", locationId: "Martinez Health Center · Immunization Bay", siteName: "Martinez Health Center", designation: "primary", serialNumber: "FF-2C-44129", dataLoggerModel: "LogTag UTRIX-16", dataLoggerSerial: "LT-88205", probeType: "swappable", calibrationExpires: "2026-10-18", alarmLowF: 36, alarmHighF: 46 },
      { unitId: "VFC-FR-MWC-01", type: "Refrigerator", locationId: "Martinez Wellness Center · Vaccine Room", siteName: "Martinez Wellness Center", designation: "primary", serialNumber: "FF-2C-44217", dataLoggerModel: "LogTag UTRIX-16", dataLoggerSerial: "LT-88311", probeType: "swappable", calibrationExpires: "2026-04-12", alarmLowF: 36, alarmHighF: 46 },
      { unitId: "PRIV-FR-MWC-01", type: "Refrigerator", locationId: "Martinez Wellness Center · Vaccine Room", siteName: "Martinez Wellness Center", designation: "primary", serialNumber: "FF-2C-44218", dataLoggerModel: "LogTag UTRIX-16", dataLoggerSerial: "LT-88312", probeType: "swappable", calibrationExpires: "2026-04-12", alarmLowF: 36, alarmHighF: 46 },
      { unitId: "VFC-FZ-CCRMC-01", type: "Freezer", locationId: "CCRMC · Pharmacy", siteName: "Contra Costa Regional Medical Center", designation: "primary", serialNumber: "FZ-3D-22091", dataLoggerModel: "LogTag UTRED30-16", dataLoggerSerial: "LT-88401", probeType: "swappable", calibrationExpires: "2026-08-08", alarmLowF: -22, alarmHighF: 5 },
    ],
    vfcRoles: [
      { role: "Provider of Record", name: "Dr. R. Alvarez", credential: "MD", trainingComplete: true, trainingDate: "2026-01-09", responsibilities: ["Sign VFC enrollment annually with CDPH", "Final accountability for VFC compliance across CCRMC + Martinez clinics", "Approve vaccine orders submitted via MyCAVax"] },
      { role: "Provider of Record Designee", name: "Dr. K. Singh", credential: "MD", trainingComplete: true, trainingDate: "2026-01-09", responsibilities: ["Stand in for POR during absences", "Co-sign storage & handling SOPs", "Authorize emergency vaccine transfers between Martinez sites"] },
      { role: "Vaccine Coordinator", name: "Maria Gutierrez", credential: "RN", trainingComplete: true, trainingDate: "2026-01-16", responsibilities: ["Twice-daily temperature monitoring per fridge", "Monthly physical inventory + Physical Inventory Form", "Place vaccine orders through MyCAVax", "Report SEW (Spoiled/Expired/Wasted) doses", "Coordinate CDPH Field Representative site visits"] },
      { role: "Backup Vaccine Coordinator", name: "Tyler Nguyen", credential: "MA", trainingComplete: true, trainingDate: "2026-01-21", responsibilities: ["Fill in for Vaccine Coordinator during PTO / training", "Assist with monthly physical inventory at Martinez Health Center"] },
      { role: "Immunizations Lead", name: "Sandra Okafor", credential: "RN, BSN", trainingComplete: true, trainingDate: "2026-02-04", responsibilities: ["Distribute VIS (Vaccine Information Statement) at every visit", "Screen and document VFC eligibility per dose", "Submit dose administration data to CAIR2"] },
    ],
    vfcTasks: [
      { cadence: "daily", title: "Twice-daily temperature monitoring", description: "Record min/max temp per fridge at AM open and PM close. Log on the Temperature Log Form.", status: "on-track", lastCompleted: "2026-03-15 (PM)", nextDue: "2026-03-16 (PM)" },
      { cadence: "bi-weekly", title: "Supervisor certifies temperature logs", description: "Vaccine Coordinator or POR reviews 2 weeks of twice-daily logs and signs.", status: "on-track", lastCompleted: "2026-03-13", nextDue: "2026-03-27" },
      { cadence: "monthly", title: "Physical vaccine inventory + form", description: "Count every dose by lot at each Martinez site, reconcile against MyCAVax, complete Physical Inventory Form.", status: "on-track", lastCompleted: "2026-02-20", nextDue: "2026-03-20" },
      { cadence: "monthly", title: "Expiration check + FIFO rotation", description: "Pull soonest-expiring doses to front of each fridge; remove expired doses immediately to prevent admin errors.", status: "on-track", lastCompleted: "2026-02-20", nextDue: "2026-03-20" },
      { cadence: "annual", title: "VFC program recertification", description: "POR signs annual provider agreement; coordinators complete EZIZ refresher; site reviews accountability records.", status: "due-soon", nextDue: "2026-05-02" },
      { cadence: "annual", title: "Data logger calibration renewal", description: "Replace or recalibrate all data loggers before calibration expiration. Martinez Wellness calibration expires 2026-04-12.", status: "due-soon", nextDue: "2026-04-12" },
      { cadence: "annual", title: "6-month expiry transfer to other VFC providers", description: "Vaccines expiring within 6 months that cannot be used must be transferred to other active VFC providers and reported in MyCAVax.", status: "on-track", nextDue: "rolling" },
      { cadence: "as-needed", title: "SEW (Spoiled/Expired/Wasted) reporting", description: "Submit SEW events to MyCAVax within program timelines; dispose per practice protocol.", status: "complete", lastCompleted: "2026-03-10" },
    ],
    vfcSEW: [
      { id: "SEW-2026-CC-007", date: "2026-03-10", category: "wasted", vaccine: "Influenza", brand: "Fluzone Quadrivalent", lot: "FZ-2025-1004", doses: 3, reason: "Drawn but patient declined at last minute (open vial)", reportedToMyCAVax: true, disposalStatus: "completed" },
      { id: "SEW-2026-CC-006", date: "2026-02-26", category: "expired", vaccine: "Hep A (Pediatric)", brand: "Havrix", lot: "HA-0918-D", doses: 2, reason: "Low demand at Martinez Wellness, past expiration", reportedToMyCAVax: true, disposalStatus: "completed" },
      { id: "SEW-2026-CC-005", date: "2026-02-09", category: "spoiled", vaccine: "Varicella", brand: "Varivax", lot: "VV-1227-A", doses: 1, reason: "Temp excursion at Martinez Wellness VFC fridge", reportedToMyCAVax: true, disposalStatus: "completed" },
    ],
    locationImbalances: [
      {
        itemId: "VAX-MMR",
        itemName: "MMR Vaccine (M-M-R II)",
        fromLocation: "Martinez Wellness Center · VFC Fridge",
        fromPctOfPar: 165,
        toLocation: "Martinez Health Center · VFC Fridge",
        toPctOfPar: 35,
        suggestedQty: 12,
        reason: "MWC overstocked + nearing expiration (Apr 18). MHC well-child schedule needs 12 doses next 2 weeks.",
      },
      {
        itemId: "VAX-DTAP",
        itemName: "DTaP (Daptacel)",
        fromLocation: "Martinez Health Center · VFC Fridge",
        fromPctOfPar: 142,
        toLocation: "CCRMC · Peds VFC Fridge",
        toPctOfPar: 48,
        suggestedQty: 18,
        reason: "MHC bulk delivery last week left excess. CCRMC Peds running through doses faster this month.",
      },
      {
        itemId: "INV-TAM",
        itemName: "Tamiflu (Oseltamivir 75mg)",
        fromLocation: "CCRMC · Pharmacy",
        fromPctOfPar: 95,
        toLocation: "Martinez Wellness Center · Pharmacy",
        toPctOfPar: 22,
        suggestedQty: 30,
        reason: "MWC depleting under flu surge. CCRMC pharmacy has buffer until next PO arrives.",
      },
    ],
    itemsNeedingAttention: [
      { id: "ATT-CC-01", name: "MMR Vaccine (M-M-R II)", department: "Pediatrics", status: "expiring-soon", currentStock: 14, parLevel: 30, expirationDate: "2026-04-18", fridge: "VFC", site: "Martinez Wellness Center", action: "Use first (FIFO) or transfer to another VFC provider via MyCAVax" },
      { id: "ATT-CC-02", name: "Tdap (Adacel)", department: "Pediatrics", status: "expiring-soon", currentStock: 22, parLevel: 40, expirationDate: "2026-04-26", fridge: "VFC", site: "Martinez Health Center", action: "Schedule catch-up adolescent clinic; transfer surplus" },
      { id: "ATT-CC-03", name: "Hep B Pediatric (Engerix-B)", department: "Pediatrics", status: "expiring-soon", currentStock: 18, parLevel: 35, expirationDate: "2026-05-08", fridge: "VFC", site: "CCRMC — Peds Clinic", action: "Pull to front of fridge; align with well-child schedule" },
      { id: "ATT-CC-04", name: "Tamiflu (Oseltamivir 75mg)", department: "Pharmacy", status: "critical", currentStock: 18, parLevel: 120, action: "Expedited PO to McKesson — flu surge predicted" },
      { id: "ATT-CC-05", name: "N95 Respirator Masks", department: "Materials Mgmt", status: "critical", currentStock: 240, parLevel: 600, action: "PO to 3M — distribute to CCRMC ED + both Martinez clinics" },
      { id: "ATT-CC-06", name: "Rapid Flu Test Kits", department: "Laboratory", status: "out-of-stock", currentStock: 0, parLevel: 400, action: "Out at all 3 sites — Abbott order placed" },
    ],
  },
};

export const DEFAULT_TENANT: TenantId = "contra-costa";
