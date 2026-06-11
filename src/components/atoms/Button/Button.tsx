import { MouseEventHandler, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonType } from '../../../types';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import { RlsSpinner } from '../Spinner/Spinner';

interface ButtonProps extends RlsComponent {
  type: RlsButtonType;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  prefixIcon?: string;
  requesting?: boolean;
  suffixIcon?: string;
}

export function RlsButton({
  type,
  children,
  disabled,
  identifier,
  onClick,
  prefixIcon,
  requesting,
  rlsTheme,
  suffixIcon
}: ButtonProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-button__content', { type });
  }, [type]);

  return (
    <button
      id={identifier}
      className="rls-button"
      onClick={onClick}
      rls-theme={rlsTheme}
      disabled={disabled}
    >
      <div className={className}>
        {requesting && <RlsSpinner />}

        {prefixIcon && <RlsIcon value={prefixIcon} />}

        {children && <div className="rls-button__description">{children}</div>}

        {suffixIcon && <RlsIcon value={suffixIcon} />}
      </div>
    </button>
  );
}
