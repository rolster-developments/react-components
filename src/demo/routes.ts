export interface DemoRoute {
  icon: string;
  id: string;
  label: string;
  path: string;
}

export const DEMO_ROUTES: DemoRoute[] = [
  { id: 'table', icon: 'grid', label: 'Data Table', path: '/table' },
  { id: 'search', icon: 'search', label: 'Search', path: '/search' },
  { id: 'sales', icon: 'trending-up', label: 'Sales', path: '/sales' },
  { id: 'inputs', icon: 'edit-text', label: 'Inputs', path: '/inputs' },
  {
    id: 'ecommerce',
    icon: 'shopping-cart',
    label: 'Ecommerce',
    path: '/ecommerce'
  }
];

export const DEMO_FALLBACK_PATH = '/table';
