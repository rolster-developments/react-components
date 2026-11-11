export interface ParentOffset {
  x: number;
  y: number;
}

export function resolveParentOffset(component: HTMLElement): ParentOffset {
  const parent = component.offsetParent as HTMLElement | null;

  if (!parent) {
    return { x: 0, y: 0 };
  }

  if (parent === document.body) {
    return { x: window.scrollX, y: window.scrollY };
  }

  const rect = parent.getBoundingClientRect();

  return {
    x: parent.scrollLeft - rect.left - parent.clientLeft,
    y: parent.scrollTop - rect.top - parent.clientTop
  };
}
