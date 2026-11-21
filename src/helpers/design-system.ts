import { DEFAULT_DESIGN_SYSTEM } from '../definitions';
import { RlsDesignSystem } from '../types';

const DESIGN_SYSTEM_PREFIX = 'rls-design-system';

export const DESIGN_SYSTEMS: RlsDesignSystem[] = [
  'bordered',
  'filled',
  'gradient',
  'rome'
];

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

export function nextDesignSystem(
  designSystems: RlsDesignSystem[],
  current: RlsDesignSystem
): RlsDesignSystem {
  const index = designSystems.indexOf(current);

  return designSystems[(index + 1) % designSystems.length] ?? current;
}
