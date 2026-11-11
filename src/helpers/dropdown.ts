export type DropdownOrigin = '0% 0%' | '100% 0%' | '0% 100%' | '100% 100%';

type DropdownAxisOrigin = '0%' | '100%';

export interface DropdownRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface DropdownSize {
  height: number;
  width: number;
}

export interface DropdownOptions {
  cover?: boolean;
  margin?: number;
}

export interface DropdownPosition {
  origin: DropdownOrigin;
  x: number;
  y: number;
}

interface DropdownAxis {
  origin: DropdownAxisOrigin;
  position: number;
}

const DEFAULT_MARGIN = 8;

function resolveHorizontal(
  trigger: DropdownRect,
  content: DropdownSize,
  viewport: DropdownSize,
  margin: number
): DropdownAxis {
  if (trigger.x + content.width <= viewport.width) {
    return { position: trigger.x, origin: '0%' };
  }

  const rightAligned = trigger.x + trigger.width - content.width;

  if (rightAligned > 0) {
    return { position: rightAligned, origin: '100%' };
  }

  return { position: viewport.width - content.width - margin, origin: '0%' };
}

function resolveBelow(
  trigger: DropdownRect,
  content: DropdownSize,
  viewport: DropdownSize,
  margin: number
): DropdownAxis {
  const below = trigger.y + trigger.height;

  if (below + content.height <= viewport.height) {
    return { position: below, origin: '0%' };
  }

  const above = trigger.y - content.height;

  if (above > 0) {
    return { position: above, origin: '100%' };
  }

  return { position: viewport.height - content.height - margin, origin: '0%' };
}

function resolveCover(
  trigger: DropdownRect,
  content: DropdownSize,
  viewport: DropdownSize,
  margin: number
): DropdownAxis {
  if (trigger.y + content.height <= viewport.height) {
    return { position: trigger.y, origin: '0%' };
  }

  const bottomAligned = trigger.y + trigger.height - content.height;

  if (bottomAligned > 0) {
    return { position: bottomAligned, origin: '100%' };
  }

  return { position: viewport.height - content.height - margin, origin: '0%' };
}

export function resolveDropdownPosition(
  trigger: DropdownRect,
  content: DropdownSize,
  viewport: DropdownSize,
  options: DropdownOptions = {}
): DropdownPosition {
  const margin = options.margin ?? DEFAULT_MARGIN;

  const horizontal = resolveHorizontal(trigger, content, viewport, margin);

  const vertical = options.cover
    ? resolveCover(trigger, content, viewport, margin)
    : resolveBelow(trigger, content, viewport, margin);

  return {
    x: horizontal.position,
    y: vertical.position,
    origin: `${horizontal.origin} ${vertical.origin}`
  };
}
