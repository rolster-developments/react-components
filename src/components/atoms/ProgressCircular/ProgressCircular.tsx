import { memo } from 'react';
import { PropsWithRlsSize, PropsWithRlsTheme } from '../../definitions';

interface ProgressCircularProps extends PropsWithRlsTheme, PropsWithRlsSize {}

function RlsProgressCircularComponent({
  rlsSize,
  rlsTheme
}: ProgressCircularProps) {
  return (
    <div
      className="rls-progress-circular"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <svg className="rls-progress-circular__svg" viewBox="0 0 36 36">
        <circle
          className="rls-progress-circular__circle"
          cx="18"
          cy="18"
          r="12"
        ></circle>
      </svg>
    </div>
  );
}

export const RlsProgressCircular = memo(RlsProgressCircularComponent);
