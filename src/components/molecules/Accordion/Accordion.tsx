import {
  ReactNode,
  TransitionEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

interface RlsAccordionProps extends RlsComponent {
  title: ReactNode;
  bordered?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean) => void;
  opened?: boolean;
}

export function RlsAccordion({
  bordered,
  children,
  className,
  disabled,
  identifier,
  onToggle,
  opened,
  rlsTheme,
  title
}: RlsAccordionProps) {
  const [open, setOpen] = useState(opened);
  const [animating, setAnimating] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const classNameAccordion = useMemo(() => {
    return renderClassStatus(
      'rls-accordion',
      { bordered, disabled, open, animating },
      className
    );
  }, [animating, bordered, className, disabled, open]);

  const onClickHeader = useCallback(() => {
    if (!disabled) {
      setOpen((current) => {
        const next = !current;

        onToggle?.(next);

        return next;
      });
    }
  }, [disabled, onToggle]);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      element.style.height = open ? 'auto' : '0px';

      return;
    }

    setAnimating(true);

    if (open) {
      const target = element.scrollHeight;
      element.style.height = '0px';

      requestAnimationFrame(() => {
        element.style.height = `${target}px`;
      });
    } else {
      element.style.height = `${element.scrollHeight}px`;

      requestAnimationFrame(() => {
        element.style.height = '0px';
      });
    }
  }, [open]);

  const onTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName === 'height') {
        const element = contentRef.current;

        if (element && open) {
          element.style.height = 'auto';
        }

        setAnimating(false);
      }
    },
    [open]
  );

  return (
    <div id={identifier} className={classNameAccordion} rls-theme={rlsTheme}>
      <button
        type="button"
        className="rls-accordion__header"
        aria-expanded={open}
        disabled={disabled}
        onClick={onClickHeader}
      >
        <span className="rls-accordion__title">{title}</span>

        <span className="rls-accordion__indicator">
          <RlsIcon value="chevron-down" />
        </span>
      </button>

      <div
        ref={contentRef}
        className="rls-accordion__body"
        aria-hidden={!open}
        onTransitionEnd={onTransitionEnd}
      >
        <div className="rls-accordion__content">{children}</div>
      </div>
    </div>
  );
}
