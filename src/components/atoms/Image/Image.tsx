import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsSkeleton } from '../Skeleton/Skeleton';

interface ImageProps extends RlsComponent {
  src: Undefined<string>;
}

export function RlsImage({ src, rlsTheme }: ImageProps) {
  const [srcIsComplet, setSrcIsComplet] = useState(false);
  const refImage = useRef<HTMLImageElement>(null);

  const className = useMemo(() => {
    return renderClassStatus('rls-image', { complet: srcIsComplet });
  }, [srcIsComplet]);

  useEffect(() => {
    setSrcIsComplet(!!(src && refImage.current?.complete));
  }, [src]);

  const onLoad = useCallback(() => {
    setSrcIsComplet(true);
  }, []);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {!srcIsComplet && <RlsSkeleton rlsTheme={rlsTheme} />}
      <img ref={refImage} src={src} onLoad={onLoad} />
    </div>
  );
}
