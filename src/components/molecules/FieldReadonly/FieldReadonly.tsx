import { memo } from 'react';
import { RlsComponent } from '../../definitions';

interface FieldReadonlyProps extends RlsComponent {
  value: string;
}

function RlsFieldReadonlyComponent({
  children,
  identifier,
  rlsTheme,
  value
}: FieldReadonlyProps) {
  return (
    <div
      id={identifier}
      className="rls-field-readonly rls-field-box"
      rls-theme={rlsTheme}
    >
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            className="rls-input__component"
            autoComplete="off"
            type={'text'}
            readOnly={true}
            value={value}
          />
        </div>
      </div>
    </div>
  );
}

export const RlsFieldReadonly = memo(RlsFieldReadonlyComponent);
