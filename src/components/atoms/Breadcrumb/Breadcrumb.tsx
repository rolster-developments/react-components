import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsTheme } from '../../definitions';
import './Breadcrumb.css';

export interface BreadcrumbLabel {
  label: string;
  onClick?: () => void;
  rlsTheme?: RlsTheme;
}

interface BreadcrumbProps {
  labels: BreadcrumbLabel[];
}

interface BreadcrumbLabelProps {
  label: BreadcrumbLabel;
}

function RlsBreadcrumbLabel({ label }: BreadcrumbLabelProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-breadcrumb__label__a', {
      actionable: !!label.onClick
    });
  }, [label.onClick]);

  return (
    <label
      className="rls-breadcrumb__label"
      onClick={label.onClick}
      rls-theme={label.rlsTheme}
    >
      <a className={className}>{label.label}</a>
    </label>
  );
}

export function RlsBreadcrumb({ labels }: BreadcrumbProps) {
  return (
    <div className="rls-breadcrumb">
      {labels.map((label, index) => (
        <RlsBreadcrumbLabel key={index} label={label} />
      ))}
    </div>
  );
}
