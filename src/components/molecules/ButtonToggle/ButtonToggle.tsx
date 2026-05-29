import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
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

export function RlsButtonToggle({
  onAction,
  options,
  type,
  automatic,
  disabled,
  rlsTheme
}: ButtonToggleProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const [action, setAction] = useState(options[0]);
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
  const classNameList = useMemo(() => {
    return renderClassStatus('rls-button-toggle__list', {
      hide: !visible,
      visible
    });
  }, [visible]);

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

  const onClickAction = useCallback(() => {
    action && onAction(action.value);
  }, [action, onAction]);

  const onClickOption = useCallback(
    (event: MouseEvent<HTMLLIElement>) => {
      const index = Number(event.currentTarget.dataset.index);
      const option = options[index];

      option && onSelectAction(option);
    },
    [options, onSelectAction]
  );

  return (
    <div className="rls-button-toggle" ref={componentRef} rls-theme={rlsTheme}>
      <div className="rls-button-toggle__content">
        {action && (
          <div className="rls-button-toggle__action">
            <RlsButton
              disabled={disabled}
              type={type}
              onClick={onClickAction}
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

      <div className={classNameList}>
        <ul>
          {options.map((action, index) => (
            <li
              className="rls-truncate"
              key={index}
              data-index={index}
              onClick={onClickOption}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
