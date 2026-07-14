import { useCallback } from 'react';

import { RlsIcon } from '../../atoms/Icon/Icon';

export interface NavbarMenuOption {
  icon: string;
  id: string;
  label: string;
}

interface NavbarMenuProps {
  options: NavbarMenuOption[];
  onOption?: (option: NavbarMenuOption) => void;
}

interface NavbarMenuOptionProps {
  option: NavbarMenuOption;
  onOption?: (option: NavbarMenuOption) => void;
}

function RlsNavbarMenuOption({ option, onOption }: NavbarMenuOptionProps) {
  const onClick = useCallback(() => {
    onOption?.(option);
  }, [onOption]);

  return (
    <li className="rls-app__page__nav__option" onClick={onClick}>
      <RlsIcon value={option.icon} />
      <span className="rls-label-font">{option.label}</span>
    </li>
  );
}

export function RlsNavbarMenu({ options, onOption }: NavbarMenuProps) {
  return (
    <ul className="rls-app__page__nav__menu">
      {options.map((option) => (
        <RlsNavbarMenuOption
          key={option.id}
          option={option}
          onOption={onOption}
        />
      ))}
    </ul>
  );
}
