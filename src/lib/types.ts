export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  durationMin: number;
  priceFrom: number;
  priceTo?: number;
  popular?: boolean;
  sortOrder?: number;
}

export interface Branch {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  mapsUrl?: string;
  whatsapp?: string;
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  branchId: string;
  specialties: string[];
  bio: string;
  image: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  branchId: string;
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  loyaltyPoints?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  categoryId: string;
  before: string;
  after: string;
  stylistId?: string;
  sortOrder?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  publishedAt: string;
  tags: string[];
}

export interface OccupancySlot {
  hour: number;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface SiteData {
  branches: Branch[];
  serviceCategories: ServiceCategory[];
  services: Service[];
  stylists: Stylist[];
  appointments: Appointment[];
  gallery: GalleryItem[];
  posts: BlogPost[];
  occupancy: OccupancySlot[];
  settings: {
    salonName: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    mapsUrl: string;
    whatsapp: string;
    hours: { day: string; open: string; close: string; closed?: boolean }[];
    loyaltyPerVisit: number;
  };
}
