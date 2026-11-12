import {
  KeyboardEvent,
  memo,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
  TransitionEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

type AccordionToggleEvent =
  | MouseEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>;

interface RlsAccordionProps extends RlsComponent {
  title: ReactNode;
  bordered?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean, event?: AccordionToggleEvent) => void;
  opened?: boolean;
}

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [tabindex]';

function fromNestedControl(event: SyntheticEvent<HTMLDivElement>): boolean {
  const control = (event.target as HTMLElement).closest(INTERACTIVE_SELECTOR);

  return !!control && control !== event.currentTarget;
}

function RlsAccordionComponent({
  bordered,
  children,
  className,
  disabled,
  identifier,
  rlsSize,
  onToggle,
  opened,
  rlsTheme,
  title
}: RlsAccordionProps) {
  const [open, setOpen] = useState(opened);
  const [animating, setAnimating] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const classNameAccordion = renderClassStatus(
    'rls-accordion',
    { bordered, disabled, open, animating },
    className
  );

  const toggle = useCallback(
    (event: AccordionToggleEvent) => {
      setOpen((current) => {
        const next = !current;

        onToggle?.(next, event);

        return next;
      });
    },
    [onToggle]
  );

  const onClickHeader = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!disabled && !fromNestedControl(event)) {
        toggle(event);
      }
    },
    [disabled, toggle]
  );

  const onKeyDownHeader = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (
        !disabled &&
        event.target === event.currentTarget &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        toggle(event);
      }
    },
    [disabled, toggle]
  );

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
    <div
      id={identifier}
      className={classNameAccordion}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div
        className="rls-accordion__header"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={!!open}
        aria-disabled={disabled}
        onClick={onClickHeader}
        onKeyDown={onKeyDownHeader}
      >
        <div className="rls-accordion__title">{title}</div>

        <span className="rls-accordion__indicator">
          <RlsIcon value="chevron-down" />
        </span>
      </div>

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

export const RlsAccordion = memo(RlsAccordionComponent);
