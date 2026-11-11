import {
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonType } from '../../../types';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsComponent } from '../../definitions';

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

function RlsButtonToggleComponent({
  onAction,
  options,
  type,
  automatic,
  disabled,
  rlsSize,
  rlsTheme
}: ButtonToggleProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const [action, setAction] = useState(options[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onCloseMenu({ target }: any) {
      if (!componentRef?.current?.contains(target)) {
        setVisible(false);
      }
    }

    document.addEventListener('click', onCloseMenu);

    return () => {
      document.removeEventListener('click', onCloseMenu);
    };
  }, []);
  const classNameList = renderClassStatus('rls-button-toggle__list', {
    hide: !visible,
    visible
  });

  const onClickMenu = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  const onSelectAction = useCallback(
    (action: ButtonToggleOption) => {
      setAction(() => action);
      setVisible(() => false);

      if (automatic) {
        onAction(action.value);
      }
    },
    [onAction, automatic]
  );

  const onClickAction = useCallback(() => {
    if (action) {
      onAction(action.value);
    }
  }, [action, onAction]);

  const onClickOption = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.index);
      const option = options[index];

      if (option) {
        onSelectAction(option);

        componentRef.current
          ?.querySelector<HTMLButtonElement>('.rls-button-toggle__icon button')
          ?.focus();
      }
    },
    [options, onSelectAction]
  );

  return (
    <div
      className="rls-button-toggle"
      ref={componentRef}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-button-toggle__content">
        {action && (
          <div className="rls-button-toggle__action">
            <RlsButton disabled={disabled} type={type} onClick={onClickAction}>
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

      <div className={classNameList} aria-hidden={!visible}>
        <ul>
          {options.map((action, index) => (
            <li key={index}>
              <button
                type="button"
                className="rls-truncate"
                data-index={index}
                tabIndex={visible ? undefined : -1}
                onClick={onClickOption}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const RlsButtonToggle = memo(RlsButtonToggleComponent);
