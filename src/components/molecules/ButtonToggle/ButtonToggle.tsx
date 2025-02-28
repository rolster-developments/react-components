import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useRenderClassStatus } from '../../../controllers';
import { RlsButtonType, RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './ButtonToggle.css';

export interface ButtonToggleOption {
  label: ReactNode;
  value: string;
}

interface ButtonToggleProps extends RlsComponent {
  onAction: (value: string) => void;
  options: ButtonToggleOption[];
  type: RlsButtonType;
  automatic?: boolean;
  disabled?: boolean;
}

export function RlsButtonToggle({
  onAction,
  options,
  type,
  automatic,
  disabled,
  rlsTheme
}: ButtonToggleProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const [firstAction] = options;

  const [action, setAction] = useState(firstAction);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onCloseMenu({ target }: any) {
      !componentRef?.current?.contains(target) && setVisible(false);
    }

    document.addEventListener('click', onCloseMenu);

    return () => {
      document.removeEventListener('click', onCloseMenu);
    };
  }, []);

  const onClickMenu = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  const onSelectAction = useCallback(
    (action: ButtonToggleOption) => {
      setAction(() => action);
      setVisible(() => false);

      automatic && onAction(action.value);
    },
    [onAction, automatic]
  );

  return (
    <div className="rls-button-toggle" ref={componentRef} rls-theme={rlsTheme}>
      <div className="rls-button-toggle__content">
        {action && (
          <div className="rls-button-toggle__action">
            <RlsButton
              disabled={disabled}
              type={type}
              onClick={() => {
                onAction(action.value);
              }}
            >
              {action.label}
            </RlsButton>
          </div>
        )}

        <div className="rls-button-toggle__icon">
          <RlsButton
            type={type}
            prefixIcon="arrow-ios-down"
            disabled={disabled}
            onClick={onClickMenu}
          />
        </div>
      </div>

      <div
        className={useRenderClassStatus('rls-button-toggle__list', {
          visible,
          hide: !visible
        })}
      >
        <ul>
          {options.map((action, index) => (
            <li
              className="truncate"
              key={index}
              onClick={() => {
                onSelectAction(action);
              }}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
