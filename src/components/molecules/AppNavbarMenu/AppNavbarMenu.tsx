import { memo, useCallback } from 'react';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { PropsWithRlsSize } from '../../definitions';

export interface AppNavbarMenuOption {
  icon: string;
  id: string;
  label: string;
}

interface NavbarMenuProps extends PropsWithRlsSize {
  options: AppNavbarMenuOption[];
  onOption?: (option: AppNavbarMenuOption) => void;
}

interface AppNavbarMenuOptionProps {
  option: AppNavbarMenuOption;
  onOption?: (option: AppNavbarMenuOption) => void;
}

function RlsAppNavbarMenuOption({ option, onOption }: AppNavbarMenuOptionProps) {
  const onClick = useCallback(() => {
    onOption?.(option);
  }, [onOption]);

  return (
    <li>
      <button
        type="button"
        className="rls-app-navbar__option"
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
  rlsSize,
  onOption
}: NavbarMenuProps) {
  return (
    <ul className="rls-app-navbar__menu" rls-size={rlsSize}>
      {options.map((option) => (
        <RlsAppNavbarMenuOption
          key={option.id}
          option={option}
          onOption={onOption}
        />
      ))}
    </ul>
  );
}

export const RlsAppNavbarMenu = memo(RlsAppNavbarMenuComponent);
