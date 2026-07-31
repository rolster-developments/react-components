import { memo } from 'react';
import { PropsWithRlsTheme } from '../../definitions';

function RlsProgressCircularComponent({ rlsTheme }: PropsWithRlsTheme) {
  return (
    <div className="rls-progress-circular" rls-theme={rlsTheme}>
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
