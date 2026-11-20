import { RlsTheme } from '../../types';
import { ProductStatus } from '../data/store';

interface RevenueInput {
  price: number;
  sales?: number;
}

const STATUS_THEME: Record<ProductStatus, RlsTheme> = {
  available: 'success',
  outOfStock: 'danger',
  inactive: 'neutral'
};

const STATUS_LABEL: Record<ProductStatus, string> = {
  available: 'Available',
  outOfStock: 'Out of stock',
  inactive: 'Inactive'
};

export function productRevenue({
  price,
  sales
}: RevenueInput): number | undefined {
  return sales === undefined
    ? undefined
    : Math.round(price * sales * 100) / 100;
}

export function categoryPercentage(value: number, max: number): number {
  return max > 0 ? Math.min((value / max) * 100, 100) : 0;
}

export function productStatusTheme(status: ProductStatus): RlsTheme {
  return STATUS_THEME[status] ?? 'neutral';
}

export function productStatusLabel(status: ProductStatus): string {
  return STATUS_LABEL[status] ?? '';
}
