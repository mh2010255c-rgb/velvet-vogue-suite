import { useState, useCallback } from 'react';

export type DressStatus = 'Available' | 'Reserved' | 'Rented' | 'Under Cleaning' | 'Sold';
export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Refunded';

export interface Dress {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  images: string[];
  salePrice: number;
  rentalPrice: number;
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
  bookingDate: string;
  returnDate: string;
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

// Sample data
export const sampleDresses: Dress[] = [
  { id: '1', name: 'Celestial Evening Gown', category: 'Evening', size: 'M', color: 'Champagne Gold', images: [], salePrice: 85000, rentalPrice: 15000, depositAmount: 5000, condition: 'Excellent', notes: 'Hand-beaded bodice', status: 'Available', createdAt: '2025-01-15' },
  { id: '2', name: 'Rose Petal Ballgown', category: 'Wedding', size: 'S', color: 'Blush Pink', images: [], salePrice: 120000, rentalPrice: 25000, depositAmount: 10000, condition: 'New', notes: 'Imported lace overlay', status: 'Rented', createdAt: '2025-02-01' },
  { id: '3', name: 'Midnight Velvet Dress', category: 'Cocktail', size: 'L', color: 'Navy Blue', images: [], salePrice: 45000, rentalPrice: 8000, depositAmount: 3000, condition: 'Good', notes: '', status: 'Available', createdAt: '2025-02-10' },
  { id: '4', name: 'Diamond Cascade Gown', category: 'Evening', size: 'M', color: 'Silver', images: [], salePrice: 95000, rentalPrice: 18000, depositAmount: 7000, condition: 'Excellent', notes: 'Crystal embellishments', status: 'Reserved', createdAt: '2025-03-01' },
  { id: '5', name: 'Ruby Enchantment', category: 'Cocktail', size: 'XS', color: 'Deep Red', images: [], salePrice: 55000, rentalPrice: 10000, depositAmount: 4000, condition: 'New', notes: '', status: 'Under Cleaning', createdAt: '2025-03-05' },
  { id: '6', name: 'Pearl Bridal Classic', category: 'Wedding', size: 'M', color: 'Ivory', images: [], salePrice: 150000, rentalPrice: 30000, depositAmount: 12000, condition: 'Excellent', notes: 'Cathedral train', status: 'Sold', createdAt: '2025-01-20' },
  { id: '7', name: 'Emerald Dream Gown', category: 'Evening', size: 'L', color: 'Emerald Green', images: [], salePrice: 78000, rentalPrice: 14000, depositAmount: 5000, condition: 'Good', notes: 'Satin finish', status: 'Available', createdAt: '2025-03-10' },
  { id: '8', name: 'Sakura Blossom Dress', category: 'Cocktail', size: 'S', color: 'Soft Pink', images: [], salePrice: 42000, rentalPrice: 7000, depositAmount: 3000, condition: 'New', notes: 'Floral appliqué', status: 'Available', createdAt: '2025-03-12' },
];

export const sampleBookings: Booking[] = [
  { id: 'b1', dressId: '2', customerName: 'Amina Benali', phone: '0555123456', wilaya: 'Algiers', address: '12 Rue Didouche Mourad', bookingDate: '2025-04-01', returnDate: '2025-04-05', depositPaid: 10000, totalAmount: 25000, paymentStatus: 'Paid', notes: 'Wedding event', createdAt: '2025-03-28' },
  { id: 'b2', dressId: '4', customerName: 'Sara Meziane', phone: '0661789012', wilaya: 'Oran', address: '5 Bd Front de Mer', bookingDate: '2025-04-10', returnDate: '2025-04-12', depositPaid: 7000, totalAmount: 18000, paymentStatus: 'Partial', notes: 'Engagement party', createdAt: '2025-04-02' },
  { id: 'b3', dressId: '1', customerName: 'Lina Hadj', phone: '0770456789', wilaya: 'Constantine', address: '8 Rue Belouizdad', bookingDate: '2025-04-15', returnDate: '2025-04-17', depositPaid: 5000, totalAmount: 15000, paymentStatus: 'Pending', notes: '', createdAt: '2025-04-08' },
];

export const sampleCustomers: Customer[] = [
  { id: 'c1', name: 'Amina Benali', phone: '0555123456', wilaya: 'Algiers', address: '12 Rue Didouche Mourad', totalSpent: 65000, bookingCount: 3 },
  { id: 'c2', name: 'Sara Meziane', phone: '0661789012', wilaya: 'Oran', address: '5 Bd Front de Mer', totalSpent: 43000, bookingCount: 2 },
  { id: 'c3', name: 'Lina Hadj', phone: '0770456789', wilaya: 'Constantine', address: '8 Rue Belouizdad', totalSpent: 15000, bookingCount: 1 },
  { id: 'c4', name: 'Nadia Khelifi', phone: '0550987654', wilaya: 'Blida', address: '22 Rue des Frères', totalSpent: 88000, bookingCount: 4 },
];

export const categories = ['Wedding', 'Evening', 'Cocktail', 'Traditional', 'Casual'];
export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const colors = ['Champagne Gold', 'Blush Pink', 'Navy Blue', 'Silver', 'Deep Red', 'Ivory', 'Emerald Green', 'Soft Pink', 'Black', 'White'];
export const dressStatuses: DressStatus[] = ['Available', 'Reserved', 'Rented', 'Under Cleaning', 'Sold'];
export const wilayas = ['Algiers', 'Oran', 'Constantine', 'Blida', 'Setif', 'Annaba', 'Tlemcen', 'Batna', 'Bejaia', 'Tizi Ouzou'];

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', { style: 'decimal' }).format(amount) + ' DA';
}
