import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface PosterProps extends RlsComponent {
  contrasted?: boolean;
}

function RlsPosterComponent({
  children,
  contrasted,
  rlsTheme
}: PosterProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-poster', { contrasted });
  }, [contrasted]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}

export const RlsPoster = memo(RlsPosterComponent);
