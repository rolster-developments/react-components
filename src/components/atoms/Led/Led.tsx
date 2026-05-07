import { PropsWithRlsTheme } from '../../definitions';

export function RlsLed({ rlsTheme }: PropsWithRlsTheme) {
  return <div className="rls-led" rls-theme={rlsTheme}></div>;
}
