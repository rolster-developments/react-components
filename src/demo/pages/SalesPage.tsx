import { RolsterListElement } from '@rolster/components';
import { useFormControl, useInputControl } from '@rolster/react-forms';
import { useCallback, useState } from 'react';
import {
  RlsAmount,
  RlsBallot,
  RlsButton,
  RlsButtonAction,
  RlsCard,
  RlsCheckBox,
  RlsChip,
  RlsDatatable,
  RlsDatatableCell,
  RlsDatatableHeader,
  RlsDatatableRecord,
  RlsDatatableTitle,
  RlsFieldSelect,
  RlsIcon,
  RlsInputSearch,
  RlsProgressBar,
  RlsTabs
} from '../../index';
import {
  CATEGORY_SALES,
  INVOICES,
  PAGE_SIZES,
  STORE_PRODUCTS,
  StoreProduct,
  VISITORS,
  VISITORS_GROWTH
} from '../data/store';
import {
  categoryPercentage,
  productRevenue,
  productStatusLabel,
  productStatusTheme
} from '../helpers/store';

import './SalesPage.scss';

const PAGE_SIZE_OPTIONS = PAGE_SIZES.map(
  (size) => new RolsterListElement(size)
);

const SECTION_TABS = [
  { label: 'Profile', value: 'profile' },
  { label: 'Overview', value: 'overview', defaultActive: true },
  { label: 'Analytics', value: 'analytics' }
];

const CATEGORY_MAX = Math.max(...CATEGORY_SALES.map(({ value }) => value));

function RowCheck() {
  const [checked, setChecked] = useState(false);

  const onClick = useCallback(() => {
    setChecked((state) => !state);
  }, []);

  return <RlsCheckBox checked={checked} onClick={onClick} />;
}

interface ProductRowProps {
  product: StoreProduct;
}

function ProductRow({ product }: ProductRowProps) {
  const { currency, icon, name, price, sales, status } = product;
  const revenue = productRevenue(product);

  return (
    <RlsDatatableRecord truncated={true}>
      <RlsDatatableCell control={true}>
        <RowCheck />
      </RlsDatatableCell>

      <RlsDatatableCell className="rls-width-xs-30">
        <RlsBallot initials={name.charAt(0)}>
          <p className="rls-truncate">{name}</p>
        </RlsBallot>
      </RlsDatatableCell>

      <RlsDatatableCell className="rls-width-xs-15">
        <RlsAmount value={price} decimals={2} symbol={currency} />
      </RlsDatatableCell>

      <RlsDatatableCell className="rls-width-xs-20">
        <RlsChip rlsTheme={productStatusTheme(status)}>
          {productStatusLabel(status)}
        </RlsChip>
      </RlsDatatableCell>

      <RlsDatatableCell className="rls-width-xs-15">
        <span className="rls-body-font">{sales ?? '—'}</span>
      </RlsDatatableCell>

      <RlsDatatableCell className="rls-width-xs-20">
        {revenue === undefined ? (
          <span className="rls-body-font">—</span>
        ) : (
          <RlsAmount value={revenue} decimals={2} symbol={currency} />
        )}
      </RlsDatatableCell>

      <RlsDatatableCell className="sales-page__icon">
        <RlsIcon value={icon} />
      </RlsDatatableCell>
    </RlsDatatableRecord>
  );
}

export function SalesPage() {
  const searchControl = useInputControl<string>('');
  const sectionControl = useFormControl<string>('overview');
  const pageSizeControl = useFormControl<string>(PAGE_SIZES[0]);

  return (
    <section className="sales-page">
      <aside className="sales-page__analytics">
        <span className="rls-label-font">ANALYTICS</span>

        <RlsCard className="sales-page__metric">
          <span className="rls-caption-font">
            Visitors <RlsIcon value="trending-up" rlsTheme="success" />{' '}
            {VISITORS_GROWTH}%
          </span>

          <span className="rls-subtitle-font">{VISITORS} users</span>
        </RlsCard>

        <div className="sales-page__group">
          <span className="rls-label-font">Top Selling Categories</span>

          {CATEGORY_SALES.map(({ name, value }) => (
            <div key={name} className="sales-page__category">
              <span className="rls-caption-font">{name}</span>

              <RlsProgressBar
                percentage={categoryPercentage(value, CATEGORY_MAX)}
                rlsTheme="primary"
              />
            </div>
          ))}
        </div>

        <div className="sales-page__group">
          <span className="rls-label-font">MONTHLY INVOICES</span>

          {INVOICES.map(({ detail, icon, name, period, total }) => (
            <div key={name} className="sales-page__invoice">
              <RlsBallot
                initials={name.charAt(0)}
                subtitle={<span className="rls-caption-font">{detail}</span>}
              >
                <span className="rls-body-font-semibold">{name}</span>
              </RlsBallot>

              <div className="sales-page__invoice__total">
                <RlsAmount value={total} decimals={2} symbol="$" />

                <span className="rls-caption-font">{period}</span>

                <RlsIcon value={icon} />
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="sales-page__main">
        <div className="sales-page__bar">
          <RlsTabs
            tabs={SECTION_TABS}
            formControl={sectionControl}
            value="overview"
          />

          <div className="sales-page__bar__actions">
            <RlsInputSearch
              formControl={searchControl}
              placeholder="Type something for search..."
            />

            <RlsButton type="ghost" prefixIcon="funnel">
              Filter
            </RlsButton>

            <RlsButtonAction icon="list" type="ghost" tooltip="Table view" />

            <RlsButtonAction icon="grid" type="ghost" tooltip="Grid view" />
          </div>
        </div>

        <div className="sales-page__summary">
          <RlsBallot
            subtitle={
              <span className="rls-caption-font">
                Manage your store and increase sales.
              </span>
            }
          >
            <span className="rls-subtitle-font">Overview</span>
          </RlsBallot>

          <div className="sales-page__summary__actions">
            <RlsButton type="ghost" prefixIcon="briefcase">
              View report
            </RlsButton>

            <RlsFieldSelect
              formControl={pageSizeControl}
              suggestions={PAGE_SIZE_OPTIONS}
              placeholder="Items per page"
            />
          </div>
        </div>

        <RlsDatatable
          header={
            <RlsDatatableHeader>
              <RlsDatatableTitle control={true} />
              <RlsDatatableTitle className="rls-width-xs-30">
                <span>Name</span>
              </RlsDatatableTitle>
              <RlsDatatableTitle className="rls-width-xs-15">
                <span>Price</span>
              </RlsDatatableTitle>
              <RlsDatatableTitle className="rls-width-xs-20">
                <span>Status</span>
              </RlsDatatableTitle>
              <RlsDatatableTitle className="rls-width-xs-15">
                <span>Sales</span>
              </RlsDatatableTitle>
              <RlsDatatableTitle className="rls-width-xs-20">
                <span>Revenue</span>
              </RlsDatatableTitle>
              <RlsDatatableTitle className="sales-page__icon" />
            </RlsDatatableHeader>
          }
        >
          {STORE_PRODUCTS.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </RlsDatatable>
      </div>
    </section>
  );
}
