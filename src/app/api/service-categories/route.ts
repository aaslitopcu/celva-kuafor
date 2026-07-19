import { NextResponse } from "next/server";
import {
  createServiceCategory,
  deleteServiceCategory,
  getServiceCategories,
  updateServiceCategory,
} from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { ServiceCategory } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getServiceCategories());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Kategori adı gerekli" }, { status: 400 });
  }

  const created = await createServiceCategory({
    name,
    slug: body.slug ? String(body.slug).trim() : undefined,
    sortOrder:
      body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
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

  const patch: Partial<ServiceCategory> = {};
  if (rest.name !== undefined) patch.name = String(rest.name).trim();
  if (rest.slug !== undefined) patch.slug = String(rest.slug).trim();
  if (rest.sortOrder !== undefined) patch.sortOrder = Number(rest.sortOrder);

  const updated = await updateServiceCategory(String(id), patch);
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

  const result = await deleteServiceCategory(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
