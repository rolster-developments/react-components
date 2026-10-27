import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithRlsSize, PropsWithRlsTheme } from '../../definitions';

export interface BreadcrumbLabel extends PropsWithRlsTheme {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps extends PropsWithRlsSize {
  labels: BreadcrumbLabel[];
}

interface BreadcrumbLabelProps {
  label: BreadcrumbLabel;
}

function RlsBreadcrumbLabel({ label }: BreadcrumbLabelProps) {
  const className = renderClassStatus('rls-breadcrumb__label__a', {
    actionable: !!label.onClick
  });

  return (
    <span className="rls-breadcrumb__label" onClick={label.onClick}>
      <a className={className} rls-theme={label.rlsTheme}>
        {label.label}
      </a>
    </span>
  );
}

function RlsBreadcrumbComponent({ labels, rlsSize }: BreadcrumbProps) {
  const children = useMemo(() => {
    return labels.map((label, index) => (
      <RlsBreadcrumbLabel key={index} label={label} />
    ));
  }, [labels]);

  return (
    <div className="rls-breadcrumb" rls-size={rlsSize}>
      {children}
    </div>
  );
}

export const RlsBreadcrumb = memo(RlsBreadcrumbComponent);
