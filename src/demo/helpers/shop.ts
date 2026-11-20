export type StarKind = 'full' | 'half' | 'empty';

const STARS = 5;

export function ratingStars(rating: number): StarKind[] {
  const bounded = Math.min(Math.max(rating, 0), STARS);
  const halves = Math.floor(bounded * 2) / 2;

  return new Array(STARS).fill('empty').map((_, index) => {
    if (halves >= index + 1) {
      return 'full';
    }

    return halves >= index + 0.5 ? 'half' : 'empty';
  });
}

export function orderTotal(subtotal: number, shipping: number): number {
  return Math.round((subtotal + shipping) * 100) / 100;
}
