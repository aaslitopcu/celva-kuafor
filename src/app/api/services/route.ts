import { NextResponse } from "next/server";
import {
  createService,
  deleteService,
  getServiceCategories,
  getServices,
  updateService,
} from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { Service } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getServices());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const categoryId = String(body.categoryId || "").trim();
  const durationMin = Number(body.durationMin);
  const priceFrom = Number(body.priceFrom);
  const priceTo = body.priceTo ? Number(body.priceTo) : undefined;

  if (!name || !categoryId) {
    return NextResponse.json(
      { error: "Ad ve kategori gerekli" },
      { status: 400 },
    );
  }
  if (!Number.isFinite(durationMin) || durationMin <= 0) {
    return NextResponse.json({ error: "Geçerli süre girin" }, { status: 400 });
  }
  if (!Number.isFinite(priceFrom) || priceFrom < 0) {
    return NextResponse.json({ error: "Geçerli fiyat girin" }, { status: 400 });
  }

  const categories = await getServiceCategories();
  if (!categories.some((c) => c.id === categoryId)) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
  }

  try {
    const created = await createService({
      name,
      description,
      categoryId,
      durationMin,
      priceFrom,
      priceTo,
      popular: Boolean(body.popular),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Eklenemedi" },
      { status: 400 },
    );
  }
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

  const patch: Partial<Service> = {};
  if (rest.name !== undefined) patch.name = String(rest.name).trim();
  if (rest.description !== undefined) {
    patch.description = String(rest.description).trim();
  }
  if (rest.categoryId !== undefined) {
    const categoryId = String(rest.categoryId).trim();
    const categories = await getServiceCategories();
    if (!categories.some((c) => c.id === categoryId)) {
      return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
    }
    patch.categoryId = categoryId;
  }
  if (rest.durationMin !== undefined) patch.durationMin = Number(rest.durationMin);
  if (rest.priceFrom !== undefined) patch.priceFrom = Number(rest.priceFrom);
  if (rest.priceTo !== undefined) {
    patch.priceTo = rest.priceTo ? Number(rest.priceTo) : undefined;
  }
  if (rest.popular !== undefined) patch.popular = Boolean(rest.popular);
  if (rest.sortOrder !== undefined) patch.sortOrder = Number(rest.sortOrder);

  try {
    const updated = await updateService(String(id), patch);
    if (!updated) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kaydedilemedi" },
      { status: 400 },
    );
  }
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

  const ok = await deleteService(id);
  if (!ok) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
