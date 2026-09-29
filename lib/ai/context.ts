import { getOrganizationContext } from "@/lib/request-context";
import { hasPermission } from "@/lib/permissions/policies";
import { sql } from "@/db/client";

export async function getPermissionFilteredContext() {
  const context = await getOrganizationContext();
  if (!context || !context.organizationId) {
    return { error: "No organization context found.", data: null };
  }

  const { organizationId, role } = context;
  const db = sql();

  let patientData = [];
  let appointmentData = [];
  let screeningData = [];
  let referralData = [];

  const freshness = new Date().toISOString();
  const sources = ["HospitalX Database"];

  if (hasPermission(role, "patients:read")) {
    patientData = (await db`SELECT * FROM patients WHERE organization_id = ${organizationId} LIMIT 5`) as any[];
  }

  if (hasPermission(role, "appointments:read")) {
    appointmentData = (await db`SELECT * FROM appointments WHERE organization_id = ${organizationId} LIMIT 5`) as any[];
  }

  if (role === "admin" || role === "health_worker" || role === "nurse" || role === "doctor") {
    // simplified permission for screening and referrals based on role
    screeningData = (await db`SELECT * FROM screenings WHERE organization_id = ${organizationId} LIMIT 5`) as any[];
    referralData = (await db`SELECT * FROM referrals WHERE organization_id = ${organizationId} LIMIT 5`) as any[];
  }

  return {
    data: {
      patients: patientData,
      appointments: appointmentData,
      screenings: screeningData,
      referrals: referralData,
      role: role
    },
    sources,
    freshness,
  };
}
