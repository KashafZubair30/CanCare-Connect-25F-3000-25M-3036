// storage.js - the only file that touches localStorage directly


var CC = window.CC = window.CC || {};

CC.Storage = (function () {
  const KEYS = {
    users: "cc_users",
    hospitals: "cc_hospitals",
    costRecords: "cc_costRecords",
    aidPrograms: "cc_aidPrograms",
    estimates: "cc_estimates",
    auditLog: "cc_auditLog",
    
    seeded: "cc_seeded_v3"
  };

  function get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Storage read error", key, e);
      return [];
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function seed() {
    if (localStorage.getItem(KEYS.seeded)) {
      return;
    }

    const hospitals = [
      {
        id: "H1",
        name: "Shaukat Khanum Memorial Cancer Hospital & Research Centre",
        city: "Lahore",
        type: "Charity",
        specialties: ["Breast Cancer", "Leukemia"],
    
        services: "Breast Cancer, Leukemia",
        isVerified: true,
        aidAvailable: true,
        address: "7A, Block R-3, M.A. Johar Town, Lahore, Pakistan",
        machinery: [
          { machineId: "M1", machineType: "PET-CT Scanner", name: "PET-CT Scanner", status: "Active", lastUpdated: "2026-10-28" },
          { machineId: "M2", machineType: "Linear Accelerator (LINAC)", name: "Linear Accelerator (LINAC)", status: "Active", lastUpdated: "2026-10-28" },
          { machineId: "M3", machineType: "MRI Scanner", name: "MRI Scanner", status: "Active", lastUpdated: "2026-10-20" },
          { machineId: "M4", machineType: "Brachytherapy Unit", name: "Brachytherapy Unit", status: "Pending re-confirmation", lastUpdated: "2026-09-30" }
        ],
        fees: [
          { service: "Oncology consultation", billingUnit: "Per visit", fee: 2200 },
          { service: "PET-CT scan", billingUnit: "Per scan", fee: 68000 },
          { service: "Radiation therapy (LINAC)", billingUnit: "Per session", fee: 14500 }
        ]
      },
      {
        id: "H2",
        name: "Punjab Institute of Nuclear Medicine (PINUM)",
        city: "Faisalabad",
        type: "Public sector",
        specialties: ["Lung Cancer"],
        services: "Lung Cancer",
        isVerified: true,
        aidAvailable: true,
        address: "Jail Road, Faisalabad, Punjab, Pakistan",
        machinery: [
          { machineId: "M5", machineType: "PET-CT Scanner", name: "PET-CT Scanner", status: "Active", lastUpdated: "2026-10-15" },
          { machineId: "M6", machineType: "Linear Accelerator (LINAC)", name: "Linear Accelerator (LINAC)", status: "Pending re-confirmation", lastUpdated: "2026-09-10" },
          { machineId: "M7", machineType: "Cobalt-60 Unit", name: "Cobalt-60 Unit", status: "Active", lastUpdated: "2026-10-01" }
        ],
        fees: [
          { service: "Oncology consultation", billingUnit: "Per visit", fee: 500 },
          { service: "PET-CT scan", billingUnit: "Per scan", fee: 22000 },
          { service: "Radiation therapy", billingUnit: "Per session", fee: 3000 }
        ]
      },
      {
        id: "H3",
        name: "Jinnah Hospital",
        city: "Lahore",
        type: "Government-funded",
        specialties: ["Breast Cancer"],
        services: "Breast Cancer",
        isVerified: true,
        aidAvailable: true,
        address: "Allama Shabbir Usmani Road, Faisal Town, Lahore, Pakistan",
        machinery: [
          { machineId: "M8", machineType: "MRI Scanner", name: "MRI Scanner", status: "Active", lastUpdated: "2026-10-18" },
          { machineId: "M9", machineType: "Linear Accelerator (LINAC)", name: "Linear Accelerator (LINAC)", status: "Active", lastUpdated: "2026-10-05" }
        ],
        fees: [
          { service: "Oncology consultation", billingUnit: "Per visit", fee: 300 },
          { service: "Radiation therapy", billingUnit: "Per session", fee: 2500 }
        ]
      },
      {
        id: "H4",
        name: "INMOL Cancer Hospital",
        city: "Lahore",
        type: "Government-funded",
        specialties: ["Lung Cancer"],
        services: "Lung Cancer",
        isVerified: true,
        aidAvailable: true,
        address: "Sheikh Zayed Hospital Campus, Lahore, Pakistan",
        machinery: [
          { machineId: "M10", machineType: "PET-CT Scanner", name: "PET-CT Scanner", status: "Active", lastUpdated: "2026-10-22" },
          { machineId: "M11", machineType: "Brachytherapy Unit", name: "Brachytherapy Unit", status: "Active", lastUpdated: "2026-10-12" }
        ],
        fees: [
          { service: "Oncology consultation", billingUnit: "Per visit", fee: 400 },
          { service: "PET-CT scan", billingUnit: "Per scan", fee: 25000 }
        ]
      }
    ];

    const users = [
      {
        id: "U_admin",
        name: "Nadia Malik",
        email: "admin@cancare.pk",
        passwordHash: null,
        role: "Administrator",
        city: "Lahore",
        language: "en",
        status: "Active",
        staffId: "STF-001",
        verified: true,
        suspended: false
      },
      {
        id: "U_doc1",
        name: "Dr. Ayesha Raza",
        email: "ayesha.raza@shaukatkhanum.pk",
        role: "Doctor",
        city: "Lahore",
        language: "en",
        status: "Active",
        specialization: "Oncologist",
        qualifications: "MBBS, FCPS (Oncology)",
        hospitalId: "H1",
        pmdcNumber: "PMDC-44521",
        pmdcStatus: "Verified",
        verified: true,
        suspended: false
      },
      {
        id: "U_doc2",
        name: "Dr. Hamza Farooq",
        email: "hamza.farooq@example.com",
        role: "Doctor",
        city: "Lahore",
        language: "en",
        status: "Pending verification",
        specialization: "Radiologist",
        qualifications: "MBBS, FCPS (Radiology)",
        hospitalId: "H3",
        pmdcNumber: "48291-P",
        pmdcStatus: "Pending",
        verified: false,
        suspended: false
      },
      {
        id: "U_doc3",
        name: "Dr. Sana Mahmood",
        email: "sana.mahmood@example.com",
        role: "Doctor",
        city: "Faisalabad",
        language: "en",
        status: "Active",
        specialization: "Hematologist",
        qualifications: "MBBS, FCPS (Hematology)",
        hospitalId: "H2",
        pmdcNumber: "PMDC-60214",
        pmdcStatus: "Verified",
        verified: true,
        suspended: false
      },
      {
        id: "U_doc4",
        name: "Dr. Bilal Ahmed",
        email: "bilal.ahmed@example.com",
        role: "Doctor",
        city: "Lahore",
        language: "en",
        status: "Pending verification",
        specialization: "Surgical Oncologist",
        qualifications: "MBBS, FCPS (Surgery)",
        hospitalId: "H4",
        pmdcNumber: "57382-P",
        pmdcStatus: "Pending",
        verified: false,
        suspended: false
      },
      {
        id: "U_patient1",
        name: "Ali Hassan",
        email: "ali.hassan@example.com",
        role: "Patient / Caregiver",
        city: "Karachi",
        language: "en",
        status: "Suspended",
        verified: true,
        suspended: true
      },
      {
        id: "U_rep1",
        name: "Farah Ahmed",
        email: "rep@shaukatkhanum.pk",
        role: "Hospital Representative",
        city: "Islamabad",
        language: "en",
        status: "Active",
        designation: "Patient Relations Officer",
        hospitalId: "H1",
        authorisationDoc: "HSP-1001",
        verified: true,
        suspended: false
      },
      {
        id: "U_rep2",
        name: "Muhammad Usman",
        email: "usman@example.com",
        role: "Hospital Representative",
        city: "Lahore",
        language: "en",
        status: "Pending verification",
        designation: "Admin Officer",
        hospitalAuthId: "HSP-1024",
        authorisationDoc: "HSP-1024",
        verified: false,
        suspended: false
      },
      {
        id: "U_rep3",
        name: "Sara Khan",
        email: "sara.khan@example.com",
        role: "Hospital Representative",
        city: "Faisalabad",
        language: "en",
        status: "Pending verification",
        designation: "Front Desk Coordinator",
        hospitalAuthId: "HSP-1038",
        authorisationDoc: "HSP-1038",
        verified: false,
        suspended: false
      }
    ];

    const defaultPw = "Password123";

    const costRecords = [
      { id: "C1", cancerType: "Breast Cancer", stage: "Early", treatment: "Surgery", costItem: "Surgery", hospitalType: "Charity", city: "Lahore", minCost: 150000, maxCost: 280000, confidence: "High", archived: false, source: "Shaukat Khanum published rates", sourceDate: "2026-09-01" },
      { id: "C2", cancerType: "Breast Cancer", stage: "Early", treatment: "Surgery", costItem: "Surgery", hospitalType: "Government-funded", city: "Lahore", minCost: 20000, maxCost: 60000, confidence: "High", archived: false, source: "Jinnah Hospital fee schedule", sourceDate: "2026-08-15" },
      { id: "C3", cancerType: "Breast Cancer", stage: "Advanced", treatment: "Chemotherapy", costItem: "Chemotherapy", hospitalType: "Charity", city: "Lahore", minCost: 300000, maxCost: 650000, confidence: "High", archived: false, source: "Shaukat Khanum published rates", sourceDate: "2026-09-01" },
      { id: "C4", cancerType: "Lung Cancer", stage: "Early", treatment: "Radiotherapy", costItem: "Radiotherapy", hospitalType: "Public sector", city: "Faisalabad", minCost: 40000, maxCost: 90000, confidence: "Medium", archived: false, source: "PINUM fee schedule", sourceDate: "2026-07-20" },
      { id: "C5", cancerType: "Lung Cancer", stage: "Advanced", treatment: "Chemotherapy", costItem: "Chemotherapy", hospitalType: "Government-funded", city: "Lahore", minCost: 60000, maxCost: 150000, confidence: "Medium", archived: false, source: "INMOL fee schedule", sourceDate: "2026-08-01" },
      { id: "C6", cancerType: "Leukemia", stage: "Early", treatment: "Combination", costItem: "Combination therapy", hospitalType: "Charity", city: "Lahore", minCost: 400000, maxCost: 900000, confidence: "High", archived: false, source: "Shaukat Khanum published rates", sourceDate: "2026-09-10" }
    ];

    const aidPrograms = [
      { id: "A1", name: "Punjab CM Cancer Patients Program", provider: "Government of Punjab", type: "Government-funded", eligibility: "Punjab domicile; income below program threshold; referral from a registered hospital.", contact: "Healthline 1700 / pshb.punjab.gov.pk", helpline: "Healthline 1700 / pshb.punjab.gov.pk", source: "Punjab Health Department notification", lastReviewed: "2026-09-15" },
      { id: "A2", name: "Shaukat Khanum Patient Welfare Assistance", provider: "Shaukat Khanum Memorial Trust", type: "NGO-funded", eligibility: "One-time financial assessment after clinical evaluation at Shaukat Khanum.", contact: "051-111-456-456", helpline: "051-111-456-456", source: "Shaukat Khanum Memorial Trust brochure", lastReviewed: "2026-08-20" },
      { id: "A3", name: "Zakat Cancer Treatment Support", provider: "Pakistan Baitul Mal", type: "Zakat-supported", eligibility: "Mustahiq-eligible patients with medical and income documentation.", contact: "051-9245566", helpline: "051-9245566", source: "Pakistan Baitul Mal annual report", lastReviewed: "2026-07-05" }
    ];

    set(KEYS.hospitals, hospitals);
    set(KEYS.costRecords, costRecords);
    set(KEYS.aidPrograms, aidPrograms);
    set(KEYS.auditLog, []);
    set(KEYS.estimates, []);
    set(KEYS.users, users);
    localStorage.setItem("cc_default_pw_hint", defaultPw);
    localStorage.setItem(KEYS.seeded, "1");
  }

  return {
    KEYS,
    get,
    set,
    uid,
    seed,
    getUsers: () => get(KEYS.users),
    saveUsers: (v) => set(KEYS.users, v),
    getHospitals: () => get(KEYS.hospitals),
    saveHospitals: (v) => set(KEYS.hospitals, v),
    getCostRecords: () => get(KEYS.costRecords),
    saveCostRecords: (v) => set(KEYS.costRecords, v),
    getAidPrograms: () => get(KEYS.aidPrograms),
    saveAidPrograms: (v) => set(KEYS.aidPrograms, v),
    getEstimates: () => get(KEYS.estimates),
    saveEstimates: (v) => set(KEYS.estimates, v),
    getAuditLog: () => get(KEYS.auditLog),
    saveAuditLog: (v) => set(KEYS.auditLog, v),
    addAuditEntry: (adminName, action, target) => {
      const log = get(KEYS.auditLog);
      const admin = get(KEYS.users).find((u) => u.name === adminName);
      log.unshift({
        id: uid("log"),
        adminId: admin ? admin.id : null,
        adminName,
        action,
        target,
        timestamp: new Date().toISOString()
      });
      set(KEYS.auditLog, log);
    }
  };
})();

document.addEventListener("DOMContentLoaded", () => CC.Storage.seed());
