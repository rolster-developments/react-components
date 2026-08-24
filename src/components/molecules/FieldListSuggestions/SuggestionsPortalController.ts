import {
  CSSProperties,
  RefObject,
  useEffect,
  useEffectEvent,
  useState
} from 'react';
import { RlsTheme } from '../../../types';

export interface SuggestionsPortalController {
  active: boolean;
  style?: CSSProperties;
  theme?: RlsTheme;
}

function getScrollableAncestors(element: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = [];

  let parent = element.parentElement;

  while (parent && parent !== document.body) {
    const { overflow, overflowX, overflowY } = getComputedStyle(parent);

    if (/auto|scroll|hidden/.test(`${overflow}${overflowX}${overflowY}`)) {
      ancestors.push(parent);
    }

    parent = parent.parentElement;
  }

  return ancestors;
}

function anchorIsVisible(rect: DOMRect, scrollables: HTMLElement[]): boolean {
  if (!rect.width || !rect.height) {
    return false;
  }

  let top = 0;
  let left = 0;
  let bottom = window.innerHeight;
  let right = window.innerWidth;

  for (const scrollable of scrollables) {
    const scrollableRect = scrollable.getBoundingClientRect();

    top = Math.max(top, scrollableRect.top);
    left = Math.max(left, scrollableRect.left);
    bottom = Math.min(bottom, scrollableRect.bottom);
    right = Math.min(right, scrollableRect.right);
  }

  return (
    rect.bottom > top &&
    rect.top < bottom &&
    rect.right > left &&
    rect.left < right
  );
}

export function useSuggestionsPortalController(
  visible: boolean,
  refAnchor?: RefObject<HTMLElement | null>,
  onHiddenAnchor?: () => void
): SuggestionsPortalController {
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();
  const [theme, setTheme] = useState<RlsTheme>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onAnchorHidden = useEffectEvent(() => {
    onHiddenAnchor?.();
  });

  useEffect(() => {
    const anchor = refAnchor?.current;

    if (!mounted || !visible || !anchor) {
      return;
    }

    setTheme(
      (anchor.closest('[rls-theme]')?.getAttribute('rls-theme') ??
        undefined) as Undefined<RlsTheme>
    );

    const scrollables = getScrollableAncestors(anchor);

    let frame = 0;

    function reposition(): void {
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();

      if (!anchorIsVisible(rect, scrollables)) {
        onAnchorHidden();
        return;
      }

      setStyle({
        '--pvt-portal-top': `${rect.bottom}px`,
        '--pvt-portal-bottom': `${window.innerHeight - rect.top}px`,
        '--pvt-portal-left': `${rect.left}px`,
        '--pvt-portal-width': `${rect.width}px`
      } as CSSProperties);
    }

    function requestReposition(): void {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reposition);
    }

    reposition();

    window.addEventListener('scroll', requestReposition, true);
    window.addEventListener('resize', requestReposition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestReposition, true);
      window.removeEventListener('resize', requestReposition);
    };
  }, [mounted, visible, refAnchor]);

  return { active: mounted && !!refAnchor, style, theme };
}
