import { memo, MouseEventHandler } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsProgressCircular } from '../../atoms/ProgressCircular/ProgressCircular';
import { PropsWithRlsTheme } from '../../definitions';

interface ButtonProgressProps extends PropsWithRlsTheme {
  icon: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  progressing?: boolean;
}

function RlsButtonProgressComponent({
  icon,
  disabled,
  onClick,
  progressing,
  rlsTheme
}: ButtonProgressProps) {
  const className = renderClassStatus('rls-button-progress', { progressing });

  return (
    <div className={className} rls-theme={rlsTheme}>
      {!progressing && (
        <RlsButtonAction icon={icon} onClick={onClick} disabled={disabled} />
      )}
      {progressing && <RlsProgressCircular />}
    </div>
  );
}

export const RlsButtonProgress = memo(RlsButtonProgressComponent);
