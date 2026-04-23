import { RlsComponent } from '../../definitions';

export function RlsLabel({ children, rlsTheme }: RlsComponent) {
  return (
    <span className="rls-label" rls-theme={rlsTheme}>
      {children}
    </span>
  );
}
