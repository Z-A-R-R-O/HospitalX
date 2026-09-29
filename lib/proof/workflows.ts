const legacyAppointmentStatus: Record<string, string> = { SCHEDULED: "REQUESTED", WAITING: "ARRIVED" };
const appointmentTransitions: Record<string, string[]> = {
  REQUESTED: ["CONFIRMED", "ARRIVED"], CONFIRMED: ["ARRIVED"], ARRIVED: ["IN_PROGRESS"], IN_PROGRESS: ["COMPLETED"], COMPLETED: [], CANCELLED: [],
};
export function canTransitionAppointment(from: string, to: string): boolean {
  const normalizedFrom = legacyAppointmentStatus[from.toUpperCase()] ?? from.toUpperCase();
  const normalizedTo = legacyAppointmentStatus[to.toUpperCase()] ?? to.toUpperCase();
  return appointmentTransitions[normalizedFrom]?.includes(normalizedTo) ?? false;
}
export function assertExpectedVersion(current: number, expected: number | undefined): number {
  if (expected === undefined || expected !== current) throw new Error(`VERSION_CONFLICT:${current}`);
  return current + 1;
}
