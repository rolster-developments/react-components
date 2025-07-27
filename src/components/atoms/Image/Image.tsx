import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import './Image.css';

interface ImageProps {
  src: Undefined<string>;
}

export function RlsImage({ src }: ImageProps) {
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

  return <img className={className} src={src} onLoad={onLoad} />;
}
