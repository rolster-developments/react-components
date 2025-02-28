import { useRenderClassStatus } from '../../../controllers';
import './Icon.css';

interface IconProps {
  value: string;
  skeleton?: boolean;
}

export function RlsIcon({ value, skeleton }: IconProps) {
  return (
    <div className={useRenderClassStatus('rls-icon', { skeleton })}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}
