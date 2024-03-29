import { ReactControl } from '@rolster/react-forms';
import {
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import { AbstractListElement, ListCollection } from '../models';

type Elements = NodeListOf<HTMLLIElement> | undefined;

const classElement = '.rls-list-field__element';

const MAX_POSITION_VISIBLE = 4;
const LIST_SIZE_REM = 16;
const ELEMENT_SIZE_REM = 4;
const BASE_SIZE_PX = 16;
const ELEMENT_SIZE_PX = BASE_SIZE_PX * ELEMENT_SIZE_REM;
const MAZ_LIST_SIZE_PX = BASE_SIZE_PX * LIST_SIZE_REM;

export interface ListControl<T = unknown> {
  boxContentRef: RefObject<HTMLDivElement>;
  collection: ListCollection<T>;
  focused: boolean;
  higher: boolean;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  value: string;
  visible: boolean;
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFocused: Dispatch<SetStateAction<boolean>>;
  setValue: Dispatch<SetStateAction<string>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface ListControlProps<T = unknown> {
  suggestions: AbstractListElement<T>[];
  formControl?: ReactControl<HTMLElement, T>;
  higher?: boolean;
}

export function useListControl<T = unknown>({
  suggestions,
  formControl,
  higher: withHigher = false
}: ListControlProps<T>): ListControl<T> {
  const boxContentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [collection, setCollection] = useState(new ListCollection<T>([]));
  const [value, setValue] = useState('');
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  const [higher, setHigher] = useState(false);
  const [focused, setFocused] = useState(false);

  const [positionElement, setPositionElement] = useState(0);
  const [listElements, setListElements] = useState<Elements>(undefined);

  useEffect(() => {
    function onCloseSuggestions(event: MouseEvent) {
      if (!boxContentRef?.current?.contains(event.target as any)) {
        setVisible(false);
      }
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    if (visible && !opened) {
      setOpened(true);
    }

    if (!visible && opened && formControl && !formControl.touched) {
      formControl.touch();
    }

    setLocationList();
  }, [visible]);

  useEffect(() => {
    setCollection(new ListCollection(suggestions));
  }, [suggestions]);

  function setLocationList(): void {
    if (boxContentRef?.current) {
      const { top, height } = boxContentRef.current.getBoundingClientRect();
      const overflow = BASE_SIZE_PX / 2;

      const positionEnd = top + height + MAZ_LIST_SIZE_PX + overflow;

      setHigher(positionEnd > window.innerHeight);
    }
  }

  function navigationInput(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        if (visible && higher) {
          navigationInputUp();
        }
        break;

      case 'ArrowDown':
        if (visible && (withHigher || !higher)) {
          navigationInputDown();
        }
        break;
    }
  }

  function navigationElement(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        navigationElementUp();
        break;

      case 'ArrowDown':
        navigationElementDown();
        break;
    }
  }

  function navigationInputUp(): void {
    const elements =
      listRef?.current?.querySelectorAll<HTMLLIElement>(classElement);

    if (elements?.length) {
      const newPosition = elements.length - 1;

      setListElements(elements);
      setPositionElement(newPosition);

      elements.item(newPosition).focus();

      if (positionElement > MAX_POSITION_VISIBLE) {
        const elementPosition = elements.length - MAX_POSITION_VISIBLE;

        setTimeout(() => {
          listRef?.current?.scroll({
            top: ELEMENT_SIZE_PX * elementPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  function navigationInputDown(): void {
    const elements =
      listRef?.current?.querySelectorAll<HTMLLIElement>(classElement);

    if (elements?.length) {
      setListElements(elements);
      setPositionElement(0);

      elements.item(0).focus();

      setTimeout(() => {
        listRef?.current?.scroll({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  function navigationElementUp(): void {
    if (positionElement > 0) {
      const newPosition = positionElement - 1;

      setPositionElement(newPosition);

      listElements?.item(newPosition).focus();
    } else if (withHigher || !higher) {
      inputRef?.current?.focus();
    }
  }

  function navigationElementDown(): void {
    const newPosition = positionElement + 1;
    const length = listElements?.length || 0;

    if (newPosition < length) {
      setPositionElement(newPosition);

      listElements?.item(newPosition).focus();
    } else if (higher && !withHigher) {
      inputRef?.current?.focus();
    }
  }

  return {
    boxContentRef,
    collection,
    focused,
    higher,
    inputRef,
    listRef,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible,
    value,
    visible
  };
}
