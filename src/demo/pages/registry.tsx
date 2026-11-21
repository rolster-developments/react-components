import { ReactElement } from 'react';
import { EcommercePage } from './EcommercePage';
import { InputsPage } from './InputsPage';
import { PalettesPage } from './PalettesPage';
import { SalesPage } from './SalesPage';
import { SearchPage } from './SearchPage';
import { TablePage } from './TablePage';

export const DEMO_PAGES: Record<string, ReactElement> = {
  table: <TablePage />,
  search: <SearchPage />,
  sales: <SalesPage />,
  inputs: <InputsPage />,
  ecommerce: <EcommercePage />,
  palettes: <PalettesPage />
};
