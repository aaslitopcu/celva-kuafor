import { NextResponse } from "next/server";
import {
  createStylist,
  deleteStylist,
  getBranches,
  getServiceCategories,
  getStylists,
  updateStylist,
} from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { Stylist } from "@/lib/types";

async function normalizeSpecialties(value: unknown): Promise<string[]> {
  if (!Array.isArray(value)) return [];
  const categories = await getServiceCategories();
  const ids = new Set(categories.map((c) => c.id));
  return value
    .map((c) => String(c))
    .filter((c) => ids.has(c));
}

export async function GET() {
  return NextResponse.json(await getStylists());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const title = String(body.title || "").trim();
  const bio = String(body.bio || "").trim();
  const image = String(body.image || "").trim();
  const branchId = String(body.branchId || "").trim();
  const specialties = await normalizeSpecialties(body.specialties);

  if (!name || !title) {
    return NextResponse.json(
      { error: "Ad ve unvan gerekli" },
      { status: 400 },
    );
  }
  if (!branchId) {
    return NextResponse.json({ error: "Şube seçin" }, { status: 400 });
  }
  const branches = await getBranches();
  if (!branches.some((b) => b.id === branchId)) {
    return NextResponse.json({ error: "Geçersiz şube" }, { status: 400 });
  }
  if (!specialties.length) {
    return NextResponse.json(
      { error: "En az bir uzmanlık seçin" },
      { status: 400 },
    );
  }

  try {
    const created = await createStylist({
      name,
      title,
      branchId,
      bio,
      image:
        image ||
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
      specialties,
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

  const patch: Partial<Stylist> = {};
  if (rest.name !== undefined) patch.name = String(rest.name).trim();
  if (rest.title !== undefined) patch.title = String(rest.title).trim();
  if (rest.bio !== undefined) patch.bio = String(rest.bio).trim();
  if (rest.image !== undefined) patch.image = String(rest.image).trim();
  if (rest.branchId !== undefined) {
    const branchId = String(rest.branchId).trim();
    const branches = await getBranches();
    if (!branches.some((b) => b.id === branchId)) {
      return NextResponse.json({ error: "Geçersiz şube" }, { status: 400 });
    }
    patch.branchId = branchId;
  }
  if (rest.specialties !== undefined) {
    const specialties = await normalizeSpecialties(rest.specialties);
    if (!specialties.length) {
      return NextResponse.json(
        { error: "En az bir uzmanlık seçin" },
        { status: 400 },
      );
    }
    patch.specialties = specialties;
  }

  try {
    const updated = await updateStylist(String(id), patch);
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

  const ok = await deleteStylist(id);
  if (!ok) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
