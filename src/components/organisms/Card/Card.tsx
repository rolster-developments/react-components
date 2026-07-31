import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface CardProps extends RlsComponent {
  outline?: boolean;
}

function RlsCardComponent({ children, className, outline, rlsTheme }: CardProps) {
  const classNameCard = useMemo(() => {
    return renderClassStatus('rls-card', { outline }, className);
  }, [outline, className]);

  return (
    <div className={classNameCard} rls-theme={rlsTheme}>
      <div className="rls-card__content">{children}</div>
    </div>
  );
}

export const RlsCard = memo(RlsCardComponent);
