import { memo } from 'react';
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
  const className = renderClassStatus('rls-progress-bar', { indeterminate });

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
