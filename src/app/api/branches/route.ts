import { NextResponse } from "next/server";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { Branch } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getBranches());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const address = String(body.address || "").trim();
  const city = String(body.city || "").trim();
  const email = String(body.email || "").trim();
  const mapsUrl = String(body.mapsUrl || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();

  if (!name || !phone || !address || !city) {
    return NextResponse.json(
      { error: "Ad, telefon, adres ve şehir gerekli" },
      { status: 400 },
    );
  }

  const created = await createBranch({
    name,
    phone,
    address,
    city,
    email: email || undefined,
    mapsUrl: mapsUrl || undefined,
    whatsapp: whatsapp || undefined,
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }

  const patch: Partial<Branch> = {};
  if (rest.name !== undefined) patch.name = String(rest.name).trim();
  if (rest.phone !== undefined) patch.phone = String(rest.phone).trim();
  if (rest.address !== undefined) patch.address = String(rest.address).trim();
  if (rest.city !== undefined) patch.city = String(rest.city).trim();
  if (rest.email !== undefined) {
    const email = String(rest.email).trim();
    patch.email = email || undefined;
  }
  if (rest.mapsUrl !== undefined) {
    const mapsUrl = String(rest.mapsUrl).trim();
    patch.mapsUrl = mapsUrl || undefined;
  }
  if (rest.whatsapp !== undefined) {
    const whatsapp = String(rest.whatsapp).trim();
    patch.whatsapp = whatsapp || undefined;
  }

  const updated = await updateBranch(String(id), patch);
  if (!updated) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }

  const result = await deleteBranch(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
