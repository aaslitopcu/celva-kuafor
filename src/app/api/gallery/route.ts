import { NextResponse } from "next/server";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGallery,
  getServiceCategories,
  getStylists,
  updateGalleryItem,
} from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";
import type { GalleryItem } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getGallery());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body.title || "").trim();
  const categoryId = String(body.categoryId || "").trim();
  const before = String(body.before || "").trim();
  const after = String(body.after || "").trim();
  const stylistId = String(body.stylistId || "").trim();

  if (!title || !categoryId || !before || !after) {
    return NextResponse.json(
      { error: "Başlık, kategori, önce ve sonra görseli gerekli" },
      { status: 400 },
    );
  }

  const categories = await getServiceCategories();
  if (!categories.some((c) => c.id === categoryId)) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
  }
  if (stylistId) {
    const stylists = await getStylists();
    if (!stylists.some((s) => s.id === stylistId)) {
      return NextResponse.json({ error: "Geçersiz stilist" }, { status: 400 });
    }
  }

  try {
    const created = await createGalleryItem({
      title,
      categoryId,
      before,
      after,
      stylistId: stylistId || undefined,
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

  const patch: Partial<GalleryItem> = {};
  if (rest.title !== undefined) patch.title = String(rest.title).trim();
  if (rest.before !== undefined) patch.before = String(rest.before).trim();
  if (rest.after !== undefined) patch.after = String(rest.after).trim();
  if (rest.categoryId !== undefined) {
    const categoryId = String(rest.categoryId).trim();
    const categories = await getServiceCategories();
    if (!categories.some((c) => c.id === categoryId)) {
      return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
    }
    patch.categoryId = categoryId;
  }
  if (rest.stylistId !== undefined) {
    const stylistId = String(rest.stylistId).trim();
    if (stylistId) {
      const stylists = await getStylists();
      if (!stylists.some((s) => s.id === stylistId)) {
        return NextResponse.json({ error: "Geçersiz stilist" }, { status: 400 });
      }
      patch.stylistId = stylistId;
    } else {
      patch.stylistId = undefined;
    }
  }

  try {
    const updated = await updateGalleryItem(String(id), patch);
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

  const ok = await deleteGalleryItem(id);
  if (!ok) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
