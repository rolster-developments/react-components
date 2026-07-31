import { memo, ReactNode } from 'react';
import { RlsComponent } from '../../definitions';

interface ToolbarProps extends RlsComponent {
  actions?: ReactNode[];
  subtitle?: ReactNode;
}

function RlsToolbarComponent({ actions, children, subtitle }: ToolbarProps) {
  return (
    <div className="rls-toolbar">
      <div className="rls-toolbar__description">
        {children && <label className="rls-toolbar__title">{children}</label>}
        {subtitle && (
          <label className="rls-toolbar__subtitle smalltext-semibold">
            {subtitle}
          </label>
        )}
      </div>
      {actions && (
        <div className="rls-toolbar__actions">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export const RlsToolbar = memo(RlsToolbarComponent);
