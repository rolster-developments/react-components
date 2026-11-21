import { memo, useCallback } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { PropsWithRlsSize } from '../../definitions';

export interface AppNavbarMenuOption {
  icon: string;
  id: string;
  label: string;
}

interface NavbarMenuProps extends PropsWithRlsSize {
  options: AppNavbarMenuOption[];
  activeId?: string;
  onOption?: (option: AppNavbarMenuOption) => void;
}

interface AppNavbarMenuOptionProps {
  active: boolean;
  option: AppNavbarMenuOption;
  onOption?: (option: AppNavbarMenuOption) => void;
}

function RlsAppNavbarMenuOption({
  option,
  active,
  onOption
}: AppNavbarMenuOptionProps) {
  const onClick = useCallback(() => {
    onOption?.(option);
  }, [onOption]);

  return (
    <li>
      <button
        type="button"
        className={renderClassStatus('rls-app-navbar__option', { active })}
        aria-current={active ? 'true' : undefined}
        onClick={onClick}
      >
        <RlsIcon value={option.icon} />
        <span className="rls-label-font">{option.label}</span>
      </button>
    </li>
  );
}

function RlsAppNavbarMenuComponent({
  options,
  activeId,
  rlsSize,
  onOption
}: NavbarMenuProps) {
  return (
    <ul className="rls-app-navbar__menu" rls-size={rlsSize}>
      {options.map((option) => (
        <RlsAppNavbarMenuOption
          key={option.id}
          option={option}
          active={activeId === option.id}
          onOption={onOption}
        />
      ))}
    </ul>
  );
}

export const RlsAppNavbarMenu = memo(RlsAppNavbarMenuComponent);
