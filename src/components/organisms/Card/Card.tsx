import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Card.css';

interface CardProps extends RlsComponent {
  outline?: boolean;
}

export function RlsCard({ children, outline, rlsTheme }: CardProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-card', { outline });
  }, [outline]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      <div className="rls-card__content">{children}</div>
    </div>
  );
}
