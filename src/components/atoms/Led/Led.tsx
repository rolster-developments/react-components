import { memo, useEffect, useRef } from 'react';
import { hexIsValid, normalizeHex } from '../../../helpers/color';
import { PropsWithRlsSize, PropsWithRlsTheme } from '../../definitions';

interface RlsLedProps extends PropsWithRlsTheme, PropsWithRlsSize {
  color?: string;
}

const CONTENT_BACKGROUND = '--pvt-content-background';

function RlsLedComponent({ color, rlsSize, rlsTheme }: RlsLedProps) {
  const refLed = useRef<HTMLDivElement>(null);
  const refColor = useRef<string>(undefined);

  useEffect(() => {
    if (color && hexIsValid(color)) {
      refColor.current = normalizeHex(color);
      refLed.current?.style.setProperty(CONTENT_BACKGROUND, refColor.current);
    } else if (refColor.current) {
      refColor.current = undefined;
      refLed.current?.style.setProperty(
        CONTENT_BACKGROUND,
        'var(--rls-app-color-500)'
      );
    }
  }, [color]);

  return (
    <div
      ref={refLed}
      className="rls-led"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    ></div>
  );
}

export const RlsLed = memo(RlsLedComponent);
