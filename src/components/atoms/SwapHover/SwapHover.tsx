import { memo, ReactNode } from 'react';
import { RlsComponent } from '../../definitions';

interface SwapHoverProps extends RlsComponent {
  content: ReactNode;
}

function RlsSwapHoverComponent({
  children,
  content,
  identifier,
  rlsTheme
}: SwapHoverProps) {
  return (
    <div id={identifier} className="rls-swap-hover" rls-theme={rlsTheme}>
      <div className="rls-swap-hover__primary">{children}</div>
      <div className="rls-swap-hover__secondary">{content}</div>
    </div>
  );
}

export const RlsHoverSwap = memo(RlsSwapHoverComponent);
