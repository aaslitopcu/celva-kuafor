import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { seedData } from "./seed";
import type {
  Appointment,
  Branch,
  GalleryItem,
  Service,
  ServiceCategory,
  SiteData,
  Stylist,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "src/data/store.json");

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  kesim: "cat-kesim",
  renk: "cat-renk",
  bakim: "cat-bakim",
  sekillendirme: "cat-sekillendirme",
  gelin: "cat-gelin",
};

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function defaultBranchFromSettings(settings: SiteData["settings"]): Branch {
  return {
    id: "br-main",
    name: settings.city?.split(",")[0]?.trim() || "Ana Şube",
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    city: settings.city,
    mapsUrl: settings.mapsUrl,
    whatsapp: settings.whatsapp,
  };
}

/** Migrate older store.json shapes. */
function normalizeStore(data: SiteData): { data: SiteData; dirty: boolean } {
  let dirty = false;
  const next = structuredClone(data);

  if (!Array.isArray(next.branches) || next.branches.length === 0) {
    next.branches = [defaultBranchFromSettings(next.settings)];
    dirty = true;
  }

  if (
    !Array.isArray(next.serviceCategories) ||
    next.serviceCategories.length === 0
  ) {
    next.serviceCategories = structuredClone(seedData.serviceCategories);
    dirty = true;
  }

  const categoryIds = new Set(next.serviceCategories.map((c) => c.id));
  const slugToId = new Map(
    next.serviceCategories.map((c) => [c.slug, c.id] as const),
  );
  const fallbackCategoryId = next.serviceCategories[0].id;

  next.services = next.services.map((raw, index) => {
    const s = raw as Service & { category?: string };
    let categoryId = s.categoryId;
    if (!categoryId && s.category) {
      categoryId =
        LEGACY_CATEGORY_MAP[s.category] ||
        slugToId.get(s.category) ||
        fallbackCategoryId;
      dirty = true;
    }
    if (!categoryId || !categoryIds.has(categoryId)) {
      categoryId = fallbackCategoryId;
      dirty = true;
    }
    const { category: _legacy, ...rest } = s;
    if (_legacy !== undefined) dirty = true;
    return {
      ...rest,
      categoryId,
      sortOrder: rest.sortOrder ?? index,
    };
  });

  const fallbackBranchId = next.branches[0].id;
  const branchIds = new Set(next.branches.map((b) => b.id));

  next.stylists = next.stylists.map((s) => {
    let branchId = s.branchId;
    if (!branchId || !branchIds.has(branchId)) {
      dirty = true;
      branchId = fallbackBranchId;
    }
    const specialties = (s.specialties || []).map((sp) => {
      if (categoryIds.has(sp)) return sp;
      const mapped = LEGACY_CATEGORY_MAP[sp] || slugToId.get(sp);
      if (mapped) {
        dirty = true;
        return mapped;
      }
      return sp;
    }).filter((sp) => categoryIds.has(sp));
    if (!specialties.length) {
      dirty = true;
      return { ...s, branchId, specialties: [fallbackCategoryId] };
    }
    return { ...s, branchId, specialties };
  });

  next.gallery = next.gallery.map((raw) => {
    const g = raw as (typeof next.gallery)[number] & { category?: string };
    let categoryId = g.categoryId;
    if (!categoryId && g.category) {
      categoryId =
        LEGACY_CATEGORY_MAP[g.category] ||
        slugToId.get(g.category) ||
        fallbackCategoryId;
      dirty = true;
    }
    if (!categoryId || !categoryIds.has(categoryId)) {
      categoryId = fallbackCategoryId;
      dirty = true;
    }
    const { category: _legacy, ...rest } = g;
    if (_legacy !== undefined) dirty = true;
    return { ...rest, categoryId };
  });

  const stylistBranch = new Map(
    next.stylists.map((s) => [s.id, s.branchId] as const),
  );

  next.appointments = next.appointments.map((a) => {
    if (!a.branchId || !branchIds.has(a.branchId)) {
      dirty = true;
      return {
        ...a,
        branchId: stylistBranch.get(a.stylistId) || fallbackBranchId,
      };
    }
    return a;
  });

  next.serviceCategories = [...next.serviceCategories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return { data: next, dirty };
}

/** Per-request cache: same render only reads the file once. */
export const readStore = cache(async (): Promise<SiteData> => {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as SiteData;
    if (!parsed?.services?.length || !parsed?.settings) {
      throw new Error("incomplete store");
    }
    const { data, dirty } = normalizeStore(parsed);
    if (dirty) await writeStore(data);
    return data;
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    const data = structuredClone(seedData);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
});

export async function writeStore(data: SiteData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getBranches() {
  const store = await readStore();
  return store.branches;
}

export async function getServiceCategories() {
  const store = await readStore();
  return [...store.serviceCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getServices() {
  const store = await readStore();
  return [...store.services].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export async function getStylists() {
  const store = await readStore();
  return store.stylists;
}

export async function getGallery() {
  const store = await readStore();
  return [...store.gallery].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export async function createGalleryItem(
  input: Omit<GalleryItem, "id"> & { id?: string },
) {
  const store = await readStore();
  if (!store.serviceCategories.some((c) => c.id === input.categoryId)) {
    throw new Error("Geçersiz kategori");
  }
  const item: GalleryItem = {
    id: input.id || `gal-${Date.now()}`,
    title: input.title,
    categoryId: input.categoryId,
    before: input.before,
    after: input.after,
    stylistId: input.stylistId || undefined,
    sortOrder:
      input.sortOrder ??
      store.gallery.filter((g) => g.categoryId === input.categoryId).length,
  };
  store.gallery.push(item);
  await writeStore(store);
  return item;
}

export async function updateGalleryItem(
  id: string,
  patch: Partial<GalleryItem>,
) {
  const store = await readStore();
  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  if (
    patch.categoryId &&
    !store.serviceCategories.some((c) => c.id === patch.categoryId)
  ) {
    throw new Error("Geçersiz kategori");
  }
  store.gallery[idx] = { ...store.gallery[idx], ...patch, id };
  await writeStore(store);
  return store.gallery[idx];
}

export async function deleteGalleryItem(id: string) {
  const store = await readStore();
  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  store.gallery.splice(idx, 1);
  await writeStore(store);
  return true;
}

export async function getPosts() {
  const store = await readStore();
  return store.posts;
}

export async function getPostBySlug(slug: string) {
  const store = await readStore();
  return store.posts.find((p) => p.slug === slug) ?? null;
}

export async function getSettings() {
  const store = await readStore();
  return store.settings;
}

export async function getOccupancy() {
  const store = await readStore();
  return store.occupancy;
}

export async function getAppointments() {
  const store = await readStore();
  return store.appointments;
}

export async function createAppointment(
  input: Omit<Appointment, "id" | "createdAt" | "status" | "loyaltyPoints"> & {
    status?: Appointment["status"];
  },
) {
  const store = await readStore();
  const appointment: Appointment = {
    ...input,
    id: `apt-${Date.now()}`,
    status: input.status ?? "pending",
    createdAt: new Date().toISOString(),
    loyaltyPoints: store.settings.loyaltyPerVisit,
  };
  store.appointments.unshift(appointment);
  await writeStore(store);
  return appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment["status"],
) {
  const store = await readStore();
  const apt = store.appointments.find((a) => a.id === id);
  if (!apt) return null;
  apt.status = status;
  await writeStore(store);
  return apt;
}

export async function createServiceCategory(
  input: Omit<ServiceCategory, "id" | "slug" | "sortOrder"> & {
    id?: string;
    slug?: string;
    sortOrder?: number;
  },
) {
  const store = await readStore();
  const slug = input.slug || slugify(input.name);
  const category: ServiceCategory = {
    id: input.id || `cat-${Date.now()}`,
    name: input.name,
    slug,
    sortOrder:
      input.sortOrder ??
      (store.serviceCategories.reduce(
        (max, c) => Math.max(max, c.sortOrder),
        -1,
      ) + 1),
  };
  store.serviceCategories.push(category);
  await writeStore(store);
  return category;
}

export async function updateServiceCategory(
  id: string,
  patch: Partial<ServiceCategory>,
) {
  const store = await readStore();
  const idx = store.serviceCategories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  store.serviceCategories[idx] = {
    ...store.serviceCategories[idx],
    ...patch,
    id,
  };
  await writeStore(store);
  return store.serviceCategories[idx];
}

export async function deleteServiceCategory(id: string) {
  const store = await readStore();
  if (store.serviceCategories.length <= 1) {
    return { ok: false as const, error: "En az bir kategori kalmalı" };
  }
  const hasServices = store.services.some((s) => s.categoryId === id);
  if (hasServices) {
    return {
      ok: false as const,
      error: "Bu kategoride hizmet var; önce taşıyın veya silin",
    };
  }
  const idx = store.serviceCategories.findIndex((c) => c.id === id);
  if (idx === -1) return { ok: false as const, error: "Bulunamadı" };
  store.serviceCategories.splice(idx, 1);
  await writeStore(store);
  return { ok: true as const };
}

export async function createService(
  input: Omit<Service, "id" | "slug"> & { id?: string; slug?: string },
) {
  const store = await readStore();
  if (!store.serviceCategories.some((c) => c.id === input.categoryId)) {
    throw new Error("Geçersiz kategori");
  }
  const service: Service = {
    id: input.id || `svc-${Date.now()}`,
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description,
    categoryId: input.categoryId,
    durationMin: input.durationMin,
    priceFrom: input.priceFrom,
    priceTo: input.priceTo,
    popular: input.popular,
    sortOrder:
      input.sortOrder ??
      store.services.filter((s) => s.categoryId === input.categoryId).length,
  };
  store.services.push(service);
  await writeStore(store);
  return service;
}

export async function updateService(id: string, patch: Partial<Service>) {
  const store = await readStore();
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  if (
    patch.categoryId &&
    !store.serviceCategories.some((c) => c.id === patch.categoryId)
  ) {
    throw new Error("Geçersiz kategori");
  }
  store.services[idx] = { ...store.services[idx], ...patch, id };
  await writeStore(store);
  return store.services[idx];
}

export async function deleteService(id: string) {
  const store = await readStore();
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  store.services.splice(idx, 1);
  await writeStore(store);
  return true;
}

export async function createBranch(
  input: Omit<Branch, "id"> & { id?: string },
) {
  const store = await readStore();
  const branch: Branch = {
    id: input.id || `br-${Date.now()}`,
    name: input.name,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    mapsUrl: input.mapsUrl,
    whatsapp: input.whatsapp,
  };
  store.branches.push(branch);
  await writeStore(store);
  return branch;
}

export async function updateBranch(id: string, patch: Partial<Branch>) {
  const store = await readStore();
  const idx = store.branches.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  store.branches[idx] = { ...store.branches[idx], ...patch, id };
  await writeStore(store);
  return store.branches[idx];
}

export async function deleteBranch(id: string) {
  const store = await readStore();
  if (store.branches.length <= 1) {
    return { ok: false as const, error: "En az bir şube kalmalı" };
  }
  const assigned = store.stylists.some((s) => s.branchId === id);
  if (assigned) {
    return {
      ok: false as const,
      error: "Bu şubeye bağlı stilist var; önce başka şubeye taşıyın",
    };
  }
  const idx = store.branches.findIndex((b) => b.id === id);
  if (idx === -1) return { ok: false as const, error: "Bulunamadı" };
  store.branches.splice(idx, 1);
  await writeStore(store);
  return { ok: true as const };
}

export async function createStylist(
  input: Omit<Stylist, "id"> & { id?: string },
) {
  const store = await readStore();
  if (!store.branches.some((b) => b.id === input.branchId)) {
    throw new Error("Geçersiz şube");
  }
  const stylist: Stylist = {
    id: input.id || `sty-${Date.now()}`,
    name: input.name,
    title: input.title,
    branchId: input.branchId,
    specialties: input.specialties,
    bio: input.bio,
    image: input.image,
  };
  store.stylists.push(stylist);
  await writeStore(store);
  return stylist;
}

export async function updateStylist(id: string, patch: Partial<Stylist>) {
  const store = await readStore();
  const idx = store.stylists.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  if (
    patch.branchId &&
    !store.branches.some((b) => b.id === patch.branchId)
  ) {
    throw new Error("Geçersiz şube");
  }
  store.stylists[idx] = { ...store.stylists[idx], ...patch, id };
  await writeStore(store);
  return store.stylists[idx];
}

export async function deleteStylist(id: string) {
  const store = await readStore();
  const idx = store.stylists.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  store.stylists.splice(idx, 1);
  await writeStore(store);
  return true;
}

export async function updateOccupancy(slots: SiteData["occupancy"]) {
  const store = await readStore();
  store.occupancy = slots;
  await writeStore(store);
  return store.occupancy;
}

export function getAvailableTimes(
  date: string,
  durationMin: number,
  appointments: Appointment[],
  stylistId: string,
) {
  const base = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const booked = appointments.filter(
    (a) =>
      a.date === date &&
      a.stylistId === stylistId &&
      a.status !== "cancelled",
  );

  return base.filter((slot) => {
    const start = toMinutes(slot);
    const end = start + durationMin;
    if (end > 20 * 60) return false;
    return !booked.some((a) => {
      const svcDuration = 60;
      const bStart = toMinutes(a.time);
      const bEnd = bStart + svcDuration;
      return start < bEnd && end > bStart;
    });
  });
}
