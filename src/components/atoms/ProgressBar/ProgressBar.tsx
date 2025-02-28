import { useRenderClassStatus } from '../../../controllers';
import { RlsComponent } from '../../definitions';
import './ProgressBar.css';

interface ProgressBarProps extends RlsComponent {
  indeterminate?: boolean;
  percentage?: number;
}

export function RlsProgressBar({
  indeterminate,
  percentage,
  rlsTheme
}: ProgressBarProps) {
  return (
    <div
      className={useRenderClassStatus('rls-progress-bar', { indeterminate })}
      rls-theme={rlsTheme}
    >
      <div
        className="rls-progress-bar__component"
        style={{ width: `${percentage || 0}%` }}
      ></div>
    </div>
  );
}
