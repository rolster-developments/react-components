import { useCallback, useState } from 'react';
import { setDesignSystem } from '../helpers/design-system';
import { RlsDesignSystem } from '../types';

export interface DesingSystemController {
  setValue: (value: RlsDesignSystem) => void;
  toggle: () => void;
  value: RlsDesignSystem;
}

export function useDesingSystemController(
  primaryDesignSystem: RlsDesignSystem = 'bordered',
  secondaryDesignSystem: RlsDesignSystem = 'filled'
): DesingSystemController {
  const [designSystem, setDesignSystemValue] = useState(() => {
    setDesignSystem(primaryDesignSystem);

    return primaryDesignSystem;
  });

  const setValue = useCallback((value: RlsDesignSystem) => {
    setDesignSystem(value);
    setDesignSystemValue(value);
  }, []);

  const toggle = useCallback(() => {
    const nextDesignSystem: RlsDesignSystem =
      designSystem === primaryDesignSystem
        ? secondaryDesignSystem
        : primaryDesignSystem;

    setDesignSystem(nextDesignSystem);
    setDesignSystemValue(nextDesignSystem);
  }, [designSystem, primaryDesignSystem, secondaryDesignSystem]);

  return { setValue, toggle, value: designSystem };
}
