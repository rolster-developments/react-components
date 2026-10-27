import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface CardProps extends RlsComponent {
  outline?: boolean;
}

function RlsCardComponent({
  children,
  className,
  rlsSize,
  outline,
  rlsTheme
}: CardProps) {
  const classNameCard = renderClassStatus('rls-card', { outline }, className);

  return (
    <div className={classNameCard} rls-size={rlsSize} rls-theme={rlsTheme}>
      <div className="rls-card__content">{children}</div>
    </div>
  );
}

export const RlsCard = memo(RlsCardComponent);
