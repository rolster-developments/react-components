import { navigationListFromInput } from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { FieldListSearchControl } from '../components/molecules/FieldListSuggestions/FieldListSuggestions';
import { filterByPattern } from '../helpers/suggestions';
import { reactI18n } from '../i18n';

interface Describable {
  description: string;
}

interface ChooserSearchProps<E extends Describable> {
  higher: boolean;
  listIsVisible: boolean;
  onClose: () => void;
  refContent: RefObject<HTMLDivElement | null>;
  refList: RefObject<HTMLUListElement | null>;
  suggestions: E[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface ChooserSearchController<E extends Describable> {
  elements: E[];
  searchControl?: FieldListSearchControl;
}

export function useChooserSearch<E extends Describable>({
  higher,
  listIsVisible,
  onClose,
  refContent,
  refList,
  suggestions,
  searchable,
  searchPlaceholder
}: ChooserSearchProps<E>): ChooserSearchController<E> {
  const refInput = useRef<HTMLInputElement>(null);

  const [pattern, setPattern] = useState('');

  const [placeholder, setPlaceholder] = useState(
    reactI18n('listInputPlaceholder')
  );

  useEffect(() => {
    return i18nSubscribe(() => {
      setPlaceholder(reactI18n('listInputPlaceholder'));
    });
  }, []);

  useEffect(() => {
    if (!searchable) {
      return undefined;
    }

    if (!listIsVisible) {
      setPattern('');

      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      refInput.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [listIsVisible, searchable]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.code) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          navigationListFromInput({
            content: refContent.current,
            event: event.nativeEvent,
            higher,
            list: refList.current
          });
          break;

        case 'Escape':
          event.preventDefault();
          onClose();
          refContent.current
            ?.querySelector<HTMLElement>('[role="combobox"]')
            ?.focus();
          break;

        case 'Tab':
          onClose();
          break;
      }
    },
    [higher, onClose, refContent, refList]
  );

  const elements = useMemo(
    () => (searchable ? filterByPattern(suggestions, pattern) : suggestions),
    [searchable, suggestions, pattern]
  );

  const searchControl = useMemo<FieldListSearchControl | undefined>(
    () =>
      searchable
        ? {
            pattern,
            placeholder: searchPlaceholder ?? placeholder,
            refInput,
            onChange: setPattern,
            onKeyDown
          }
        : undefined,
    [searchable, pattern, searchPlaceholder, placeholder, onKeyDown]
  );

  return { elements, searchControl };
}
