import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsSkeleton } from '../Skeleton/Skeleton';
import './Image.css';

interface ImageProps extends RlsComponent {
  src: Undefined<string>;
}

export function RlsImage({ src, rlsTheme }: ImageProps) {
  const [isComplet, setIsComplet] = useState(false);

  const refSrc = useRef(src);

  const className = useMemo(() => {
    return renderClassStatus('rls-image', { complet: isComplet });
  }, [isComplet]);

  useEffect(() => {
    if (refSrc.current !== src) {
      setIsComplet(false);
      refSrc.current = src;
    }
  }, [src]);

  const onLoad = useCallback(() => {
    setIsComplet(true);
  }, []);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {!isComplet && <RlsSkeleton rlsTheme={rlsTheme} />}
      <img src={src} onLoad={onLoad} />
    </div>
  );
}
