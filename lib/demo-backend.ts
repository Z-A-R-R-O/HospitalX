
export const mockPatients = [
  { id: "P-101", full_name: "Ananya Rao", age: 32, gender: "female", contact_number: "9876543210", status: "active", priority: "normal", blood_group: "O+", primary_complaint: "Chest pain and shortness of breath" },
  { id: "P-102", full_name: "Vikram Malhotra", age: 56, gender: "male", contact_number: "9876543211", status: "active", priority: "high", blood_group: "A-", primary_complaint: "Severe migraine and blurred vision" },
  { id: "P-103", full_name: "Priya Singh", age: 34, gender: "female", contact_number: "9876543212", status: "active", priority: "normal", blood_group: "B+", primary_complaint: "Joint pain and swelling in knees" },
  { id: "P-104", full_name: "Ramesh Das", age: 62, gender: "male", contact_number: "9876543213", status: "active", priority: "high", blood_group: "AB+", primary_complaint: "Uncontrolled diabetes and fatigue" },
  { id: "P-105", full_name: "Sunita Verma", age: 45, gender: "female", contact_number: "9876543214", status: "active", priority: "normal", blood_group: "O-", primary_complaint: "Routine cardiac follow-up" },
  { id: "P-106", full_name: "Kavita Nair", age: 28, gender: "female", contact_number: "9876543215", status: "active", priority: "normal", blood_group: "A+", primary_complaint: "Prenatal checkup" },
  { id: "P-107", full_name: "David Chen", age: 41, gender: "male", contact_number: "9876543216", status: "active", priority: "normal", blood_group: "B-", primary_complaint: "Respiratory infection" },
  { id: "P-108", full_name: "Anita Roy", age: 39, gender: "female", contact_number: "9876543217", status: "active", priority: "high", blood_group: "O+", primary_complaint: "Acute abdominal pain" }
];

export const mockDoctors = [
  { id: "DOC-01", full_name: "Dr. Rajesh Sharma", specialty: "Cardiology", role: "Chief Medical Officer", shift_start: "08:00", shift_end: "16:00", location: "OT 2", status: "In Surgery", today_appointments: 4 },
  { id: "DOC-02", full_name: "Dr. Priya Iyer", specialty: "Neurology", role: "Senior Consultant", shift_start: "09:00", shift_end: "17:00", location: "OPD Room 4", status: "Consulting", today_appointments: 6 },
  { id: "DOC-03", full_name: "Dr. Amit Mehta", specialty: "Orthopedics", role: "Consultant", shift_start: "10:00", shift_end: "18:00", location: "Staff Room A", status: "Available", today_appointments: 2 },
  { id: "DOC-04", full_name: "Dr. Kavita Nair", specialty: "Pediatrics", role: "Attending", shift_start: "07:00", shift_end: "15:00", location: "General Ward A", status: "Rounding", today_appointments: 5 }
];

export const mockNurses = [
  { id: "NUR-01", full_name: "Sister Mary", role: "Charge Nurse", ward: "Intensive Care (ICU)", shift_start: "07:00", shift_end: "15:00", patient_load: 4, status: "Active" },
  { id: "NUR-02", full_name: "Jacob Thomas", role: "Staff Nurse", ward: "General Ward A", shift_start: "07:00", shift_end: "15:00", patient_load: 12, status: "Active" },
  { id: "NUR-03", full_name: "Anita Patel", role: "Staff Nurse", ward: "Emergency (ER)", shift_start: "07:00", shift_end: "15:00", patient_load: 8, status: "Busy" },
  { id: "NUR-04", full_name: "Sarah Khan", role: "Trainee Nurse", ward: "Pediatrics", shift_start: "07:00", shift_end: "15:00", patient_load: 6, status: "Active" }
];

export const mockAppointments = [
  { id: "APT-101", full_name: "Ananya Rao", provider_name: "Dr. Rajesh Sharma", appointment_type: "In-Person", starts_at: new Date(new Date().getTime() - 3600000).toISOString(), status: "completed", priority: "normal" },
  { id: "APT-102", full_name: "Vikram Malhotra", provider_name: "Dr. Priya Iyer", appointment_type: "Telehealth", starts_at: new Date(new Date().getTime() + 1800000).toISOString(), status: "scheduled", priority: "high" },
  { id: "APT-103", full_name: "Priya Singh", provider_name: "Dr. Amit Mehta", appointment_type: "In-Person", starts_at: new Date(new Date().getTime() + 3600000).toISOString(), status: "scheduled", priority: "normal" },
  { id: "APT-104", full_name: "Ramesh Das", provider_name: "Dr. Rajesh Sharma", appointment_type: "In-Person", starts_at: new Date(new Date().getTime() - 600000).toISOString(), status: "in_consultation", priority: "high" },
  { id: "APT-105", full_name: "Sunita Verma", provider_name: "Dr. Rajesh Sharma", appointment_type: "In-Person", starts_at: new Date(new Date().getTime() + 7200000).toISOString(), status: "scheduled", priority: "normal" },
  { id: "APT-106", full_name: "Anita Roy", provider_name: "Dr. Kavita Nair", appointment_type: "Emergency", starts_at: new Date(new Date().getTime() - 1200000).toISOString(), status: "arrived", priority: "high" }
];
