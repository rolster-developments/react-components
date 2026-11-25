import { memo, useCallback, useContext, useEffect } from 'react';
import { RlsContext } from '../../../context';
import { renderClassStatus } from '../../../helpers/css';
import { RlsAppNavbarMode } from '../../../types';
import { RlsComponent } from '../../definitions';

const DRAWER_MEDIA_QUERY = '(max-width: 640px)';

interface AppNavbarProps extends RlsComponent {
  mode?: RlsAppNavbarMode;
}

function RlsAppNavbarComponent({
  children,
  identifier,
  mode = 'section',
  rlsSize,
  rlsTheme
}: AppNavbarProps) {
  const setNavbarIsCondense = useContext(RlsContext)?.setNavbarIsCondense;

  const onBackdrop = useCallback(() => {
    setNavbarIsCondense?.(true);
  }, [setNavbarIsCondense]);

  useEffect(() => {
    if (mode !== 'drawer' || !setNavbarIsCondense) {
      return;
    }

    const media = window.matchMedia?.(DRAWER_MEDIA_QUERY);

    if (!media) {
      return;
    }

    const onMedia = ({ matches }: MediaQueryList | MediaQueryListEvent) => {
      if (matches) {
        setNavbarIsCondense(true);
      }
    };

    onMedia(media);
    media.addEventListener('change', onMedia);

    return () => {
      media.removeEventListener('change', onMedia);
    };
  }, [mode, setNavbarIsCondense]);

  return (
    <nav
      id={identifier}
      className={renderClassStatus('rls-app-navbar', { mode })}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-app-navbar__content">{children}</div>

      <div
        className="rls-app-navbar__backdrop"
        role="presentation"
        onClick={onBackdrop}
      ></div>
    </nav>
  );
}

export const RlsAppNavbar = memo(RlsAppNavbarComponent);
