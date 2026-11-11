import { describe, expect, it } from 'vitest';

import { resolvePopoverPosition } from './popover';

const viewport = { width: 1000, height: 800 };
const content = { width: 200, height: 100 };
const options = { margin: 8, gap: 8, arrowInset: 14 };

describe('resolvePopoverPosition vertical', () => {
  it('should open below the trigger centered on it', () => {
    const trigger = { x: 400, y: 100, width: 80, height: 40 };

    expect(resolvePopoverPosition(trigger, content, viewport, options)).toEqual(
      {
        x: 340,
        y: 148,
        placement: 'bottom',
        arrow: 100,
        origin: '100px 0%'
      }
    );
  });

  it('should open above the trigger when there is no room below', () => {
    const trigger = { x: 400, y: 720, width: 80, height: 40 };

    expect(resolvePopoverPosition(trigger, content, viewport, options)).toEqual(
      {
        x: 340,
        y: 612,
        placement: 'top',
        arrow: 100,
        origin: '100px 100%'
      }
    );
  });

  it('should shift right and keep the arrow over the trigger near the left edge', () => {
    const trigger = { x: 10, y: 100, width: 40, height: 40 };

    expect(resolvePopoverPosition(trigger, content, viewport, options)).toEqual(
      {
        x: 8,
        y: 148,
        placement: 'bottom',
        arrow: 22,
        origin: '22px 0%'
      }
    );
  });

  it('should shift left and keep the arrow over the trigger near the right edge', () => {
    const trigger = { x: 950, y: 100, width: 40, height: 40 };

    expect(resolvePopoverPosition(trigger, content, viewport, options)).toEqual(
      {
        x: 792,
        y: 148,
        placement: 'bottom',
        arrow: 178,
        origin: '178px 0%'
      }
    );
  });

  it('should keep the arrow inside the body when the trigger is on the very edge', () => {
    const trigger = { x: 0, y: 100, width: 10, height: 40 };

    expect(resolvePopoverPosition(trigger, content, viewport, options)).toEqual(
      {
        x: 8,
        y: 148,
        placement: 'bottom',
        arrow: 14,
        origin: '14px 0%'
      }
    );
  });

  it('should pick the side with more room when it fits on neither', () => {
    const trigger = { x: 400, y: 300, width: 80, height: 40 };
    const tall = { width: 200, height: 700 };

    expect(resolvePopoverPosition(trigger, tall, viewport, options)).toEqual({
      x: 340,
      y: 348,
      placement: 'bottom',
      arrow: 100,
      origin: '100px 0%'
    });
  });
});

describe('resolvePopoverPosition horizontal', () => {
  const horizontal = { ...options, orientation: 'horizontal' as const };

  it('should open to the right of the trigger centered on it', () => {
    const trigger = { x: 400, y: 300, width: 80, height: 40 };

    expect(
      resolvePopoverPosition(trigger, content, viewport, horizontal)
    ).toEqual({
      x: 488,
      y: 270,
      placement: 'right',
      arrow: 50,
      origin: '0% 50px'
    });
  });

  it('should open to the left when there is no room on the right', () => {
    const trigger = { x: 900, y: 300, width: 80, height: 40 };

    expect(
      resolvePopoverPosition(trigger, content, viewport, horizontal)
    ).toEqual({
      x: 692,
      y: 270,
      placement: 'left',
      arrow: 50,
      origin: '100% 50px'
    });
  });

  it('should shift down and keep the arrow beside the trigger near the top edge', () => {
    const trigger = { x: 400, y: 10, width: 80, height: 40 };

    expect(
      resolvePopoverPosition(trigger, content, viewport, horizontal)
    ).toEqual({
      x: 488,
      y: 8,
      placement: 'right',
      arrow: 22,
      origin: '0% 22px'
    });
  });

  it('should pick the side with more room when it fits on neither', () => {
    const trigger = { x: 300, y: 300, width: 80, height: 40 };
    const wide = { width: 900, height: 100 };

    expect(resolvePopoverPosition(trigger, wide, viewport, horizontal)).toEqual(
      {
        x: 388,
        y: 270,
        placement: 'right',
        arrow: 50,
        origin: '0% 50px'
      }
    );
  });
});
