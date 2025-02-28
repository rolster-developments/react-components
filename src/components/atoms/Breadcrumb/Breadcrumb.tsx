import { useRenderClassStatus } from '../../../controllers';
import './Breadcrumb.css';

export interface BreadcrumbLabel {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  labels: BreadcrumbLabel[];
}

export function RlsBreadcrumb({ labels }: BreadcrumbProps) {
  return (
    <div className="rls-breadcrumb">
      {labels.map(({ label, onClick }, index) => (
        <label key={index} className="rls-breadcrumb__label" onClick={onClick}>
          <a
            className={useRenderClassStatus('rls-breadcrumb__label__a', {
              actionable: !!onClick
            })}
          >
            {label}
          </a>
        </label>
      ))}
    </div>
  );
}
