import { NextResponse } from "next/server";
import {
  createAppointment,
  getAppointments,
  getBranches,
  getStylists,
} from "@/lib/store";

export async function GET() {
  const appointments = await getAppointments();
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      branchId,
      serviceId,
      stylistId,
      date,
      time,
      notes,
    } = body;

    if (
      !customerName ||
      !phone ||
      !branchId ||
      !serviceId ||
      !stylistId ||
      !date ||
      !time
    ) {
      return NextResponse.json(
        { error: "Zorunlu alanlar eksik" },
        { status: 400 },
      );
    }

    const [branches, stylists] = await Promise.all([
      getBranches(),
      getStylists(),
    ]);
    const branch = branches.find((b) => b.id === branchId);
    if (!branch) {
      return NextResponse.json({ error: "Geçersiz şube" }, { status: 400 });
    }
    const stylist = stylists.find((s) => s.id === stylistId);
    if (!stylist || stylist.branchId !== branchId) {
      return NextResponse.json(
        { error: "Stilist seçilen şubede değil" },
        { status: 400 },
      );
    }

    const appointment = await createAppointment({
      customerName,
      phone,
      email,
      branchId,
      serviceId,
      stylistId,
      date,
      time,
      notes,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
