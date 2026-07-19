import { NextResponse } from "next/server";
import { getOccupancy, updateOccupancy } from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { OccupancySlot } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getOccupancy());
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = (await request.json()) as OccupancySlot[];
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const updated = await updateOccupancy(body);
  return NextResponse.json(updated);
}
