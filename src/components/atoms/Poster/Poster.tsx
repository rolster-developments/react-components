import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Poster.css';

interface PosterProps extends RlsComponent {
  contrasted?: boolean;
}

export function RlsPoster({ children, contrasted, rlsTheme }: PosterProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-poster', { contrasted });
  }, [contrasted]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
