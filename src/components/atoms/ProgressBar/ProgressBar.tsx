import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface ProgressBarProps extends RlsComponent {
  indeterminate?: boolean;
  percentage?: number;
}

function RlsProgressBarComponent({
  indeterminate,
  percentage,
  rlsTheme
}: ProgressBarProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-progress-bar', { indeterminate });
  }, [indeterminate]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      <div
        className="rls-progress-bar__component"
        style={{ width: `${percentage ?? 0}%` }}
      ></div>
    </div>
  );
}

export const RlsProgressBar = memo(RlsProgressBarComponent);
