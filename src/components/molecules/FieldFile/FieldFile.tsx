import { MouseEvent, useCallback, useMemo, useRef } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsComponent } from '../../definitions';
import { RolsterReactInputControl } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';

interface FieldFileProps extends RlsComponent {
  accept?: string;
  disabled?: boolean;
  formControl?: RolsterReactInputControl<File | undefined>;
  msgErrorDisabled?: boolean;
  onValue?: (value: File | undefined) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: File;
}

export function RlsFieldFile({
  accept,
  children,
  disabled: _disabled,
  formControl,
  identifier,
  msgErrorDisabled,
  onValue,
  placeholder,
  readOnly,
  rlsTheme,
  value
}: FieldFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const disabled = useMemo(
    () => formControl?.disabled || _disabled,
    [formControl?.disabled, _disabled]
  );

  const className = useMemo(
    () =>
      renderClassStatus(
        'rls-field-box',
        {
          disabled,
          error: formControl?.wrong,
          focused: formControl?.focused && !disabled,
          readonly: readOnly
        },
        'rls-field-file'
      ),
    [formControl?.focused, formControl?.wrong, readOnly, disabled]
  );

  const currentFile = useMemo(
    () => formControl?.value ?? value,
    [formControl?.value, value]
  );

  const displayValue = useMemo(() => {
    return currentFile?.name ?? '';
  }, [currentFile]);

  const onClickAction = useCallback(
    (event: MouseEvent) => {
      if (currentFile) {
        formControl?.setValue(undefined);
        onValue?.(undefined);
      } else {
        inputRef.current?.click();
      }

      event.stopPropagation();
    },
    [currentFile, formControl, onValue]
  );

  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        formControl?.setValue(file);
        onValue?.(file);
      }

      event.target.value = '';
    },
    [formControl, onValue]
  );

  const onClickControl = useCallback(() => {
    !readOnly && !disabled && inputRef.current?.click();
  }, [readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component" onClick={onClickControl}>
        <div className="rls-field-box__body">
          <input
            className="rls-input__component"
            readOnly
            type="text"
            value={displayValue}
            placeholder={placeholder}
          />

          <input
            ref={inputRef}
            className="rls-field-file__input"
            type="file"
            accept={accept}
            disabled={disabled || readOnly}
            onChange={onChangeInput}
          />

          <RlsButtonAction
            icon={currentFile ? 'close' : 'attach'}
            disabled={disabled}
            onClick={onClickAction}
          />
        </div>
      </div>

      {!msgErrorDisabled && (
        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      )}
    </div>
  );
}
