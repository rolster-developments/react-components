import { MouseEventHandler, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './Button.css';

export type RlsButtonType =
  | 'raised'
  | 'flat'
  | 'stroked'
  | 'outline'
  | 'ghost'
  | 'gradient';

interface ButtonProps extends RlsComponent {
  type: RlsButtonType;
  disabled?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function RlsButton({
  type,
  children,
  disabled,
  identifier,
  prefixIcon,
  suffixIcon,
  rlsTheme,
  onClick
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
        {prefixIcon && <RlsIcon value={prefixIcon} />}
        {children && <div className="rls-button__label">{children}</div>}
        {suffixIcon && <RlsIcon value={suffixIcon} />}
      </div>
    </button>
  );
}
