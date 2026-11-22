import { RolsterListElement } from '@rolster/components';
import { useFormControl, useInputControl } from '@rolster/react-forms';
import {
  RlsAccordion,
  RlsAmount,
  RlsBadge,
  RlsBallot,
  RlsButton,
  RlsButtonIcon,
  RlsCard,
  RlsChip,
  RlsChipGroup,
  RlsFieldSelect,
  RlsIcon,
  RlsInputSearch,
  RlsLabelCheckBox,
  RlsLabelRadioButton,
  RlsLed,
  RlsSlider
} from '../../index';
import {
  CATEGORIES,
  COLOR_THEMES,
  PAYMENTS,
  Product,
  PRODUCTS,
  SHIPPING_COST,
  SIZES
} from '../data/shop';
import { orderTotal, ratingStars } from '../helpers/shop';

import './EcommercePage.scss';

const SORT_OPTIONS = ['Popularity', 'Price', 'Rating'].map(
  (option) => new RolsterListElement(option)
);

const DETAIL_SIZES = SIZES.slice(0, 5);

interface StarsProps {
  rating: number;
}

function Stars({ rating }: StarsProps) {
  return (
    <span className="shop-page__stars">
      {ratingStars(rating).map((kind, index) => (
        <RlsIcon
          key={index}
          className={`shop-page__stars__${kind}`}
          value="star"
          rlsTheme={kind === 'empty' ? 'neutral' : 'warning'}
        />
      ))}

      <span className="rls-caption-font">{rating}</span>
    </span>
  );
}

interface CategoryOptionProps {
  checked: boolean;
  label: string;
}

function CategoryOption({ checked, label }: CategoryOptionProps) {
  const control = useInputControl<boolean>(checked);

  return <RlsLabelCheckBox formControl={control}>{label}</RlsLabelCheckBox>;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { available, brand, name, oldPrice, price, rating, tag, tagTheme } =
    product;

  return (
    <RlsCard className="shop-page__product">
      <div className="shop-page__product__header">
        <RlsBallot subtitle={<span className="rls-caption-font">{name}</span>}>
          <span className="rls-body-font-semibold">{brand}</span>
        </RlsBallot>

        {tag && (
          <RlsChip rlsTheme={tagTheme} selected={true}>
            {tag}
          </RlsChip>
        )}
      </div>

      <Stars rating={rating} />

      <div className="shop-page__product__price">
        <RlsAmount value={price} decimals={2} symbol="$" />

        {oldPrice && (
          <span className="rls-caption-font shop-page__product__old">
            <RlsAmount value={oldPrice} decimals={2} symbol="$" />
          </span>
        )}
      </div>

      <div className="shop-page__colors">
        {COLOR_THEMES.slice(0, 4).map((theme) => (
          <RlsLed key={theme} rlsTheme={theme} />
        ))}
      </div>

      <RlsButton
        type="raised"
        rlsTheme="primary"
        prefixIcon="shopping-cart"
        disabled={!available}
      >
        {available ? 'Add to cart' : 'Out of stock'}
      </RlsButton>
    </RlsCard>
  );
}

export function EcommercePage() {
  const searchControl = useInputControl<string>('Adidas');
  const sortControl = useFormControl<string>('Popularity');
  const priceControl = useFormControl<number>(40);
  const sizeControl = useFormControl<string>('40');
  const paymentControl = useFormControl<string>('PayPal');

  const detail = PRODUCTS[1];
  const total = orderTotal(detail.price, SHIPPING_COST);

  return (
    <section className="shop-page">
      <aside className="shop-page__filters">
        <RlsAccordion title="Discount" bordered={true} />

        <RlsAccordion title="Category" bordered={true} opened={true}>
          <div className="shop-page__filters__group">
            {CATEGORIES.map((category) => (
              <CategoryOption
                key={category}
                label={category}
                checked={category === 'Best Shoes'}
              />
            ))}
          </div>
        </RlsAccordion>

        <RlsAccordion title="Price" bordered={true} opened={true}>
          <div className="shop-page__filters__group">
            <RlsSlider formControl={priceControl} minValue={0} maxValue={100} />

            <div className="shop-page__filters__range">
              <span className="rls-caption-font">$50</span>
              <span className="rls-caption-font">$2,700</span>
            </div>
          </div>
        </RlsAccordion>

        <RlsAccordion title="Materials" bordered={true} />

        <RlsAccordion title="Brands" bordered={true} />

        <RlsAccordion title="Colors" bordered={true} opened={true}>
          <div className="shop-page__colors shop-page__filters__inline">
            {COLOR_THEMES.map((theme) => (
              <RlsLed key={theme} rlsTheme={theme} />
            ))}
          </div>
        </RlsAccordion>

        <RlsAccordion title="Size" bordered={true} opened={true}>
          <div className="shop-page__sizes shop-page__filters__inline">
            {SIZES.map((size) => (
              <RlsChip key={size} selected={size === '40'}>
                {size}
              </RlsChip>
            ))}
          </div>
        </RlsAccordion>
      </aside>

      <div className="shop-page__catalog">
        <div className="shop-page__bar">
          <RlsInputSearch formControl={searchControl} placeholder="Search" />

          <RlsButton
            type="raised"
            rlsTheme="success"
            prefixIcon="shopping-cart"
          >
            <span>Cart</span>
            <RlsBadge>3</RlsBadge>
          </RlsButton>
        </div>

        <div className="shop-page__summary">
          <RlsBallot
            subtitle={<span className="rls-caption-font">3000+ items</span>}
          >
            <span className="rls-subtitle-font">Spring 2021 Shoes</span>
          </RlsBallot>

          <RlsFieldSelect
            formControl={sortControl}
            suggestions={SORT_OPTIONS}
            placeholder="Sort"
          />
        </div>

        <div className="rls-flex-xs-grid-16 rls-flex-xs-grid-col-2">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <aside className="shop-page__detail">
        <RlsCard>
          <div className="shop-page__detail__header">
            <RlsBallot
              subtitle={<span className="rls-caption-font">{detail.name}</span>}
            >
              <span className="rls-body-font-semibold">{detail.brand}</span>
            </RlsBallot>

            <RlsButtonIcon icon="heart" />
          </div>

          <Stars rating={detail.rating} />

          <div className="shop-page__product__price">
            <RlsAmount value={detail.price} decimals={2} symbol="$" />

            {detail.oldPrice && (
              <span className="rls-caption-font shop-page__product__old">
                <RlsAmount value={detail.oldPrice} decimals={2} symbol="$" />
              </span>
            )}
          </div>

          <div className="shop-page__group">
            <span className="rls-label-font">Select Size</span>

            <RlsChipGroup
              className="shop-page__sizes"
              formControl={sizeControl}
              options={DETAIL_SIZES}
              value={DETAIL_SIZES[2]}
            />
          </div>

          <div className="shop-page__group">
            <span className="rls-label-font">Select Color</span>

            <div className="shop-page__colors">
              {COLOR_THEMES.map((theme) => (
                <RlsLed key={theme} rlsTheme={theme} />
              ))}
            </div>
          </div>

          <div className="shop-page__group">
            <span className="rls-label-font">Description</span>

            <p className="rls-body-font">
              The right pair of shoes will make you feel amazing and the shoe
              available combo will give rhythm to your casual summer looks.
            </p>
          </div>

          <div className="shop-page__group">
            <span className="rls-label-font">Select Payment Method</span>

            {PAYMENTS.map((payment) => (
              <RlsLabelRadioButton
                key={payment}
                formControl={paymentControl}
                value={payment}
              >
                {payment}
              </RlsLabelRadioButton>
            ))}
          </div>

          <div className="shop-page__totals">
            <div className="shop-page__totals__row">
              <span className="rls-caption-font">Subtotal</span>
              <RlsAmount value={detail.price} decimals={2} symbol="$" />
            </div>

            <div className="shop-page__totals__row">
              <span className="rls-caption-font">Shipping Cost</span>
              <RlsAmount value={SHIPPING_COST} decimals={2} symbol="$" />
            </div>

            <div className="shop-page__totals__row">
              <span className="rls-label-font">Total</span>
              <RlsAmount value={total} decimals={2} symbol="$" />
            </div>
          </div>

          <RlsButton type="raised" rlsTheme="primary" prefixIcon="shopping-bag">
            Checkout now
          </RlsButton>
        </RlsCard>
      </aside>
    </section>
  );
}
