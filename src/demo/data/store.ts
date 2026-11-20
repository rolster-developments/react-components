export type ProductStatus = 'available' | 'outOfStock' | 'inactive';

export interface StoreProduct {
  currency: string;
  icon: string;
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
  sales?: number;
}

export interface CategorySale {
  name: string;
  value: number;
}

export interface Invoice {
  detail: string;
  icon: string;
  name: string;
  period: string;
  total: number;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'phone',
    name: 'Phone',
    icon: 'smartphone',
    currency: '$',
    price: 950,
    status: 'available',
    sales: 12
  },
  {
    id: 'laptop',
    name: 'Laptop',
    icon: 'monitor',
    currency: '€',
    price: 400,
    status: 'outOfStock',
    sales: 1
  },
  {
    id: 'handheld',
    name: 'Handheld game console',
    icon: 'keypad',
    currency: '£',
    price: 299.5,
    status: 'available',
    sales: 3496
  },
  {
    id: 'headphones',
    name: 'Headphones',
    icon: 'headphones',
    currency: '$',
    price: 145,
    status: 'available'
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    icon: 'keypad',
    currency: '€',
    price: 99,
    status: 'inactive',
    sales: 105
  },
  {
    id: 'microphone',
    name: 'Microphone',
    icon: 'mic',
    currency: '$',
    price: 84.4,
    status: 'available',
    sales: 3
  },
  {
    id: 'guitar',
    name: 'Guitar',
    icon: 'music',
    currency: '$',
    price: 70.12,
    status: 'available',
    sales: 90
  },
  {
    id: 'monitor',
    name: 'Monitor',
    icon: 'monitor',
    currency: '$',
    price: 320,
    status: 'available',
    sales: 26
  }
];

export const CATEGORY_SALES: CategorySale[] = [
  { name: 'Phones', value: 2840 },
  { name: 'Laptops', value: 2110 },
  { name: 'Books', value: 1620 },
  { name: 'Donuts', value: 1180 },
  { name: 'Games', value: 760 },
  { name: 'Clothes', value: 410 }
];

export const INVOICES: Invoice[] = [
  {
    name: 'GamerzShop',
    detail: '17 new sales',
    period: 'last 28 days',
    icon: 'keypad',
    total: 15896.99
  },
  {
    name: 'Musiq',
    detail: '2 extra subscriptions',
    period: 'last 28 days',
    icon: 'music',
    total: 617.52
  },
  {
    name: 'Books Store',
    detail: '4 items out of stock',
    period: 'last 180 days',
    icon: 'book',
    total: 40309.76
  }
];

export const VISITORS = 1597;

export const VISITORS_GROWTH = 14.6;

export const PAGE_SIZES = ['12 items per page', '24 items per page'];
