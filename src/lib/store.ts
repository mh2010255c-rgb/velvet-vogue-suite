import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DressStatus = "Available" | "Reserved" | "Rented" | "Under Cleaning" | "Sold";
export type PaymentStatus = "Pending" | "Partial" | "Paid" | "Refunded";

export interface Dress {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  imageUrl: string;
  images: string[];
  salePrice: number;
  rentalPrice: number; // per day
  pricePerHour: number;
  depositAmount: number;
  condition: string;
  notes: string;
  status: DressStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  dressId: string;
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  bookingDate: string; // YYYY-MM-DD
  returnDate: string;  // YYYY-MM-DD
  depositPaid: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  notes: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  address: string;
  totalSpent: number;
  bookingCount: number;
}

// ---------- Sample seed data ----------
export const sampleDresses: Dress[] = [
  { id: "1", name: "Celestial Evening Gown", category: "Evening", size: "M", color: "Champagne Gold", imageUrl: "", images: [], salePrice: 85000, rentalPrice: 15000, pricePerHour: 2000, depositAmount: 5000, condition: "Excellent", notes: "Hand-beaded bodice", status: "Available", createdAt: "2025-01-15" },
  { id: "2", name: "Rose Petal Ballgown", category: "Wedding", size: "S", color: "Blush Pink", imageUrl: "", images: [], salePrice: 120000, rentalPrice: 25000, pricePerHour: 3500, depositAmount: 10000, condition: "New", notes: "Imported lace overlay", status: "Rented", createdAt: "2025-02-01" },
  { id: "3", name: "Midnight Velvet Dress", category: "Cocktail", size: "L", color: "Navy Blue", imageUrl: "", images: [], salePrice: 45000, rentalPrice: 8000, pricePerHour: 1200, depositAmount: 3000, condition: "Good", notes: "", status: "Available", createdAt: "2025-02-10" },
  { id: "4", name: "Diamond Cascade Gown", category: "Evening", size: "M", color: "Silver", imageUrl: "", images: [], salePrice: 95000, rentalPrice: 18000, pricePerHour: 2500, depositAmount: 7000, condition: "Excellent", notes: "Crystal embellishments", status: "Reserved", createdAt: "2025-03-01" },
  { id: "5", name: "Ruby Enchantment", category: "Cocktail", size: "XS", color: "Deep Red", imageUrl: "", images: [], salePrice: 55000, rentalPrice: 10000, pricePerHour: 1500, depositAmount: 4000, condition: "New", notes: "", status: "Available", createdAt: "2025-03-05" },
  { id: "6", name: "Pearl Bridal Classic", category: "Wedding", size: "M", color: "Ivory", imageUrl: "", images: [], salePrice: 150000, rentalPrice: 30000, pricePerHour: 4000, depositAmount: 12000, condition: "Excellent", notes: "Cathedral train", status: "Available", createdAt: "2025-01-20" },
  { id: "7", name: "Emerald Dream Gown", category: "Evening", size: "L", color: "Emerald Green", imageUrl: "", images: [], salePrice: 78000, rentalPrice: 14000, pricePerHour: 2000, depositAmount: 5000, condition: "Good", notes: "Satin finish", status: "Available", createdAt: "2025-03-10" },
  { id: "8", name: "Sakura Blossom Dress", category: "Cocktail", size: "S", color: "Soft Pink", imageUrl: "", images: [], salePrice: 42000, rentalPrice: 7000, pricePerHour: 1000, depositAmount: 3000, condition: "New", notes: "Floral appliqué", status: "Available", createdAt: "2025-03-12" },
];

export const sampleBookings: Booking[] = [
  { id: "b1", dressId: "2", customerName: "Amina Benali", phone: "0555123456", wilaya: "Algiers", address: "12 Rue Didouche Mourad", bookingDate: "2025-04-01", returnDate: "2025-04-05", depositPaid: 10000, totalAmount: 25000, paymentStatus: "Paid", notes: "Wedding event", createdAt: "2025-03-28" },
  { id: "b2", dressId: "4", customerName: "Sara Meziane", phone: "0661789012", wilaya: "Oran", address: "5 Bd Front de Mer", bookingDate: "2025-04-10", returnDate: "2025-04-12", depositPaid: 7000, totalAmount: 18000, paymentStatus: "Partial", notes: "Engagement party", createdAt: "2025-04-02" },
  { id: "b3", dressId: "1", customerName: "Lina Hadj", phone: "0770456789", wilaya: "Constantine", address: "8 Rue Belouizdad", bookingDate: "2025-04-15", returnDate: "2025-04-17", depositPaid: 5000, totalAmount: 15000, paymentStatus: "Pending", notes: "", createdAt: "2025-04-08" },
];

export const categories = ["Wedding", "Evening", "Cocktail", "Traditional", "Casual"];
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
export const colors = ["Champagne Gold", "Blush Pink", "Navy Blue", "Silver", "Deep Red", "Ivory", "Emerald Green", "Soft Pink", "Black", "White"];
export const dressStatuses: DressStatus[] = ["Available", "Reserved", "Rented", "Under Cleaning", "Sold"];
export const wilayas = ["Algiers", "Oran", "Constantine", "Blida", "Setif", "Annaba", "Tlemcen", "Batna", "Bejaia", "Tizi Ouzou"];

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", { style: "decimal" }).format(Math.round(amount)) + " DA";
}

export function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const d = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, d + 1); // inclusive day count, min 1
}

// Overlap check (inclusive). Excludes a booking by id (for editing).
export function hasBookingConflict(
  bookings: Booking[],
  dressId: string,
  start: string,
  end: string,
  excludeId?: string
): Booking | null {
  if (!dressId || !start || !end) return null;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  for (const b of bookings) {
    if (b.dressId !== dressId) continue;
    if (excludeId && b.id === excludeId) continue;
    const bs = new Date(b.bookingDate).getTime();
    const be = new Date(b.returnDate).getTime();
    if (s <= be && e >= bs) return b;
  }
  return null;
}

// ---------- Zustand store with persistence ----------
interface StoreState {
  dresses: Dress[];
  bookings: Booking[];
  addDress: (d: Omit<Dress, "id" | "createdAt">) => void;
  updateDress: (id: string, patch: Partial<Dress>) => void;
  deleteDress: (id: string) => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      dresses: sampleDresses,
      bookings: sampleBookings,
      addDress: (d) =>
        set((s) => ({
          dresses: [
            ...s.dresses,
            { ...d, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] },
          ],
        })),
      updateDress: (id, patch) =>
        set((s) => ({ dresses: s.dresses.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      deleteDress: (id) => set((s) => ({ dresses: s.dresses.filter((d) => d.id !== id) })),
      addBooking: (b) => {
        const nb: Booking = {
          ...b,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((s) => ({ bookings: [...s.bookings, nb] }));
        return nb;
      },
      updateBooking: (id, patch) =>
        set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      deleteBooking: (id) => set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),
    }),
    { name: "boutique-store-v1" }
  )
);

// Derive customers from bookings (real history)
export function getCustomersFromBookings(bookings: Booking[]): Customer[] {
  const map = new Map<string, Customer>();
  for (const b of bookings) {
    const key = b.phone || b.customerName;
    const existing = map.get(key);
    if (existing) {
      existing.totalSpent += b.totalAmount;
      existing.bookingCount += 1;
    } else {
      map.set(key, {
        id: key,
        name: b.customerName,
        phone: b.phone,
        wilaya: b.wilaya,
        address: b.address,
        totalSpent: b.totalAmount,
        bookingCount: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}
