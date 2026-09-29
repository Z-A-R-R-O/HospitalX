import { NextResponse } from "next/server";
import { updateAppointment } from "@/lib/commands/appointment";
import { CommandError, isAuthorizationError } from "@/lib/commands/handler";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { response, replayed } = await updateAppointment(request, id);
    return NextResponse.json({ ...response, source: "neon" }, { headers: { "Idempotency-Replayed": String(replayed) } });
  } catch (error: unknown) {
    if (error instanceof CommandError) return NextResponse.json({ error: error.code, message: error.message, ...error.details }, { status: error.status });
    if (isAuthorizationError(error)) return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    if ((error as Error).message?.includes("Authentication required")) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    console.error("appointment_update_failed", error);
    return NextResponse.json({ error: "Unable to update appointment" }, { status: 500 });
  }
}