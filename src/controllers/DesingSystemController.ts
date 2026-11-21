import { useCallback, useMemo, useState } from 'react';
import { nextDesignSystem, setDesignSystem } from '../helpers/design-system';
import { RlsDesignSystem } from '../types';

const DEFAULT_DESIGN_SYSTEMS: RlsDesignSystem[] = ['bordered', 'filled'];

export interface DesingSystemController {
  designSystems: RlsDesignSystem[];
  setValue: (value: RlsDesignSystem) => void;
  toggle: () => void;
  value: RlsDesignSystem;
}

export function useDesingSystemController(
  ...designSystems: RlsDesignSystem[]
): DesingSystemController {
  const key = designSystems.join('|');

  const options = useMemo<RlsDesignSystem[]>(
    () =>
      key ? (key.split('|') as RlsDesignSystem[]) : DEFAULT_DESIGN_SYSTEMS,
    [key]
  );

  const [designSystem, setDesignSystemValue] = useState(() => {
    setDesignSystem(options[0]);

    return options[0];
  });

  const setValue = useCallback((value: RlsDesignSystem) => {
    setDesignSystem(value);
    setDesignSystemValue(value);
  }, []);

  const toggle = useCallback(() => {
    const value = nextDesignSystem(options, designSystem);

    setDesignSystem(value);
    setDesignSystemValue(value);
  }, [designSystem, options]);

  return { designSystems: options, setValue, toggle, value: designSystem };
}
