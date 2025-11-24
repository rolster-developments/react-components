import { RlsComponent } from '../../definitions';
import './Label.css';

export function RlsLabel({ children, rlsTheme }: RlsComponent) {
  return (
    <span className="rls-label" rls-theme={rlsTheme}>
      {children}
    </span>
  );
}
