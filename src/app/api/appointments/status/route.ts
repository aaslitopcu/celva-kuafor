import { NextResponse } from "next/server";
import {
  getAppointments,
  updateAppointmentStatus,
} from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { Appointment } from "@/lib/types";

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body as {
    id: string;
    status: Appointment["status"];
  };

  if (!id || !status) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  const updated = await updateAppointmentStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(await getAppointments());
}
