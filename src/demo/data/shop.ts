import { RlsTheme } from '../../types';

export interface Product {
  available: boolean;
  brand: string;
  id: string;
  name: string;
  price: number;
  rating: number;
  oldPrice?: number;
  tag?: string;
  tagTheme?: RlsTheme;
}

export const PRODUCTS: Product[] = [
  {
    id: 'nikkee-running',
    brand: 'Nikkee',
    name: 'Running Sneakers',
    rating: 4.7,
    price: 169,
    tag: 'Sale',
    tagTheme: 'danger',
    available: true
  },
  {
    id: 'poooma-gucci',
    brand: 'Poooma',
    name: 'Gucci Shoes',
    rating: 4.5,
    price: 78.99,
    oldPrice: 92,
    tag: 'Best Seller',
    tagTheme: 'success',
    available: true
  },
  {
    id: 'my-hood-nice',
    brand: 'My Hood',
    name: 'Nice Shoes',
    rating: 4.2,
    price: 112.69,
    tag: 'Users Choice',
    tagTheme: 'info',
    available: true
  },
  {
    id: 'not-nice-beautiful',
    brand: 'Not Nice',
    name: 'Beautiful Sneakers',
    rating: 3.1,
    price: 90.5,
    available: false
  }
];

export const CATEGORIES = [
  'Best Shoes',
  'Boots',
  'Espadrilles',
  'Sandals',
  'Slippers'
];

export const SIZES = ['38', '39', '40', '41', '42', '43', '44'];

export const COLOR_THEMES: RlsTheme[] = [
  'obsidian',
  'amber',
  'success',
  'danger',
  'info',
  'purple'
];

export const PAYMENTS = ['PayPal', 'Visa Classic', 'Apple Pay'];

export const SHIPPING_COST = 15;
