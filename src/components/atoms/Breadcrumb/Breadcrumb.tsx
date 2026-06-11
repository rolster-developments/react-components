import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithRlsTheme } from '../../definitions';

export interface BreadcrumbLabel extends PropsWithRlsTheme {
  label: string;
  onClick?: () => void;
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
    <span className="rls-breadcrumb__label" onClick={label.onClick}>
      <a className={className} rls-theme={label.rlsTheme}>
        {label.label}
      </a>
    </span>
  );
}

export function RlsBreadcrumb({ labels }: BreadcrumbProps) {
  const children = useMemo(() => {
    return labels.map((label, index) => (
      <RlsBreadcrumbLabel key={index} label={label} />
    ));
  }, [labels]);

  return <div className="rls-breadcrumb">{children}</div>;
}
