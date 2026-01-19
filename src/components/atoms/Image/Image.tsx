import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsSkeleton } from '../Skeleton/Skeleton';
import './Image.css';

interface ImageProps extends RlsComponent {
  src: Undefined<string>;
}

export function RlsImage({ src, rlsTheme }: ImageProps) {
  const [srcIsComplet, setSrcIsComplet] = useState(false);

  const refSrc = useRef(src);

  const className = useMemo(() => {
    return renderClassStatus('rls-image', { complet: srcIsComplet });
  }, [srcIsComplet]);

  useEffect(() => {
    if (refSrc.current !== src) {
      setSrcIsComplet(false);
      refSrc.current = src;
    }
  }, [src]);

  const onLoad = useCallback(() => {
    setSrcIsComplet(true);
  }, []);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {!srcIsComplet && <RlsSkeleton rlsTheme={rlsTheme} />}
      <img src={src} onLoad={onLoad} />
    </div>
  );
}
