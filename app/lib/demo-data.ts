export const demoPatients = [
  ["MRN-8492", "Rajesh Kumar", "45 / M", "Follow-up", "Dr. Priya (Cardiology)", "In Consultation", "Now"],
  ["MRN-8493", "Meena S", "32 / F", "New Patient", "Dr. Arjun (General)", "Waiting", "12 min"],
  ["MRN-8494", "Anil Desai", "58 / M", "Emergency", "Dr. Sarah (ER)", "Triage", "Critical"],
  ["MRN-8495", "Sunita Sharma", "29 / F", "Follow-up", "Dr. Rakesh (Ortho)", "Waiting", "25 min"],
  ["MRN-8496", "Vikram Singh", "51 / M", "Consultation", "Dr. Priya (Cardiology)", "Completed", "-"],
  ["MRN-8497", "Lakshmi V", "64 / F", "Surgery Post-op", "Dr. Arjun (General)", "Admitted", "-"],
];

export const demoTasks = [
  { id: "T1", text: "3 patients with critical lab results", owner: "Dr. Sarah (ER)" },
  { id: "T2", text: "2 discharges delayed by billing", owner: "Finance Dept" },
  { id: "T3", text: "ICU Bed 4 requires immediate maintenance", owner: "Operations" },
  { id: "T4", text: "Pharmacy stock critical: Paracetamol IV", owner: "Pharmacy" }
];

export const demoOverview = {
  metrics: { 
    patients: 1248, 
    appointmentsToday: 156, 
    admissions: 42, 
    beds: 250, 
    availableBeds: 18 
  },
  source: "demo-mode",
  tasks: demoTasks
};
