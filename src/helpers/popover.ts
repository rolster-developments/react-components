export type PopoverOrientation = 'horizontal' | 'vertical';

export type PopoverPlacement = 'bottom' | 'left' | 'right' | 'top';

export interface PopoverRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface PopoverSize {
  height: number;
  width: number;
}

export interface PopoverOptions {
  arrowInset?: number;
  gap?: number;
  margin?: number;
  orientation?: PopoverOrientation;
}

export interface PopoverPosition {
  arrow: number;
  origin: string;
  placement: PopoverPlacement;
  x: number;
  y: number;
}

interface PopoverSettings {
  arrowInset: number;
  gap: number;
  margin: number;
}

const DEFAULT_MARGIN = 8;
const DEFAULT_GAP = 8;
const DEFAULT_ARROW_INSET = 16;

function clamp(value: number, minValue: number, maxValue: number): number {
  if (minValue > maxValue) {
    return minValue;
  }

  return Math.min(Math.max(value, minValue), maxValue);
}

function resolveVertical(
  trigger: PopoverRect,
  content: PopoverSize,
  viewport: PopoverSize,
  settings: PopoverSettings
): PopoverPosition {
  const triggerBottom = trigger.y + trigger.height;
  const below = triggerBottom + settings.gap;
  const above = trigger.y - settings.gap - content.height;

  const fitsBelow = below + content.height <= viewport.height - settings.margin;
  const fitsAbove = above >= settings.margin;
  const moreRoomBelow = viewport.height - triggerBottom >= trigger.y;

  const placement: PopoverPlacement =
    fitsBelow || (!fitsAbove && moreRoomBelow) ? 'bottom' : 'top';

  const center = trigger.x + trigger.width / 2;

  const x = clamp(
    center - content.width / 2,
    settings.margin,
    viewport.width - content.width - settings.margin
  );

  const arrow = clamp(
    center - x,
    settings.arrowInset,
    content.width - settings.arrowInset
  );

  return {
    arrow,
    origin: `${arrow}px ${placement === 'bottom' ? '0%' : '100%'}`,
    placement,
    x,
    y: placement === 'bottom' ? below : above
  };
}

function resolveHorizontal(
  trigger: PopoverRect,
  content: PopoverSize,
  viewport: PopoverSize,
  settings: PopoverSettings
): PopoverPosition {
  const triggerRight = trigger.x + trigger.width;
  const right = triggerRight + settings.gap;
  const left = trigger.x - settings.gap - content.width;

  const fitsRight = right + content.width <= viewport.width - settings.margin;
  const fitsLeft = left >= settings.margin;
  const moreRoomRight = viewport.width - triggerRight >= trigger.x;

  const placement: PopoverPlacement =
    fitsRight || (!fitsLeft && moreRoomRight) ? 'right' : 'left';

  const center = trigger.y + trigger.height / 2;

  const y = clamp(
    center - content.height / 2,
    settings.margin,
    viewport.height - content.height - settings.margin
  );

  const arrow = clamp(
    center - y,
    settings.arrowInset,
    content.height - settings.arrowInset
  );

  return {
    arrow,
    origin: `${placement === 'right' ? '0%' : '100%'} ${arrow}px`,
    placement,
    x: placement === 'right' ? right : left,
    y
  };
}

export function resolvePopoverPosition(
  trigger: PopoverRect,
  content: PopoverSize,
  viewport: PopoverSize,
  options: PopoverOptions = {}
): PopoverPosition {
  const settings: PopoverSettings = {
    arrowInset: options.arrowInset ?? DEFAULT_ARROW_INSET,
    gap: options.gap ?? DEFAULT_GAP,
    margin: options.margin ?? DEFAULT_MARGIN
  };

  return options.orientation === 'horizontal'
    ? resolveHorizontal(trigger, content, viewport, settings)
    : resolveVertical(trigger, content, viewport, settings);
}
