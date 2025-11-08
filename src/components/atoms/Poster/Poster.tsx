import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Poster.css';

interface PosterProps extends RlsComponent {
  contrast?: boolean;
}

export function RlsPoster({ children, contrast, rlsTheme }: PosterProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-poster', { contrast });
  }, [contrast]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
