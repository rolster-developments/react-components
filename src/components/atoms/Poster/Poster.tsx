import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Poster.css';

interface PosterProps extends RlsComponent {
  contrast?: boolean;
  outline?: boolean;
}

export function RlsPoster({
  children,
  contrast,
  outline,
  rlsTheme
}: PosterProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-poster', { contrast, outline });
  }, [contrast, outline]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
