import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface PosterProps extends RlsComponent {
  contrasted?: boolean;
}

function RlsPosterComponent({ children, contrasted, rlsTheme }: PosterProps) {
  const className = renderClassStatus('rls-poster', { contrasted });

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}

export const RlsPoster = memo(RlsPosterComponent);
