import { RlsComponent } from '../../definitions';

export function RlsSkeleton({ rlsTheme }: RlsComponent) {
  return <div className="rls-skeleton" rls-theme={rlsTheme}></div>;
}
