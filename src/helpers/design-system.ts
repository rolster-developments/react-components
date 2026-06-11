import { RlsDesignSystem } from '../types';
import { DEFAULT_DESIGN_SYSTEM } from '../definitions';

const DESIGN_SYSTEM_PREFIX = 'rls-design-system';

const DESIGN_SYSTEMS: RlsDesignSystem[] = ['bordered', 'filled'];

function designSystemClass(designSystem: RlsDesignSystem): string {
  return `${DESIGN_SYSTEM_PREFIX}-${designSystem}`;
}

export function setDesignSystem(
  designSystem: RlsDesignSystem = DEFAULT_DESIGN_SYSTEM
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const target = document.body || document.documentElement;

  DESIGN_SYSTEMS.forEach((value) => {
    target.classList.toggle(designSystemClass(value), value === designSystem);
  });
}
