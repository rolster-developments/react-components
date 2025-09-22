import { RlsComponent } from '../../definitions';

export function RlsContent({ children, identifier, rlsTheme }: RlsComponent) {
  return (
    <div
      id={identifier}
      className="rls-app__page__content"
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}
