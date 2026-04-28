import { RlsComponent } from '../../definitions';

export function RlsBody({ children, identifier, rlsTheme }: RlsComponent) {
  return (
    <div id={identifier} className="rls-app__page__body" rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
