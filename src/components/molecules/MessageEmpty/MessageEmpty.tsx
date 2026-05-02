import { ReactNode, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

interface MessageEmptyProps extends RlsComponent {
  emoji?: string;
  icon?: string;
  image?: string;
  title?: ReactNode;
}

export function RlsMessageEmpty({
  children,
  className,
  emoji,
  icon,
  identifier,
  image,
  rlsTheme,
  title
}: MessageEmptyProps) {
  const classNameMessageEmpty = useMemo(() => {
    return renderClassStatus('rls-message-empty', {}, className);
  }, [className]);

  const logo = useMemo(() => {
    if (icon) {
      return (
        <div className="rls-message-empty__logo">
          <RlsIcon value={icon} />
        </div>
      );
    }

    if (emoji) {
      return (
        <div className="rls-message-empty__logo">
          <span className="rls-message-empty__logo--emoji">{emoji}</span>
        </div>
      );
    }

    if (image) {
      return (
        <div className="rls-message-empty__logo">
          <img className="rls-message-empty__logo--image" src={image} />
        </div>
      );
    }

    return null;
  }, [icon, emoji, image]);

  return (
    <div id={identifier} className={classNameMessageEmpty} rls-theme={rlsTheme}>
      {logo}

      {title && <div className="rls-message-empty__title">{title}</div>}

      {children && <div className="rls-message-empty__content">{children}</div>}
    </div>
  );
}
