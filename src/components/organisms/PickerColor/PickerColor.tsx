import { PickerListenerEvent } from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import {
  ChangeEvent,
  KeyboardEvent,
  memo,
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useEventCallback } from '../../../controllers/EventCallbackController';
import {
  DEFAULT_COLOR,
  hexToHsv,
  HSV,
  hsvToHex,
  hsvToRgb,
  normalizeHex
} from '../../../helpers/color';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsComponent } from '../../definitions';

interface SliderKeys {
  decrease: string[];
  edges: boolean;
  increase: string[];
  pages: boolean;
}

const HORIZONTAL_KEYS: SliderKeys = {
  decrease: ['ArrowLeft'],
  edges: true,
  increase: ['ArrowRight'],
  pages: false
};

const VERTICAL_KEYS: SliderKeys = {
  decrease: ['ArrowDown'],
  edges: false,
  increase: ['ArrowUp'],
  pages: true
};

const LINEAR_KEYS: SliderKeys = {
  decrease: ['ArrowLeft', 'ArrowDown'],
  edges: true,
  increase: ['ArrowRight', 'ArrowUp'],
  pages: true
};

function valueFromKey(
  key: string,
  current: number,
  max: number,
  step: number,
  page: number,
  keys: SliderKeys
): number | undefined {
  let next: number | undefined;

  if (keys.increase.includes(key)) {
    next = current + step;
  } else if (keys.decrease.includes(key)) {
    next = current - step;
  } else if (keys.pages && key === 'PageUp') {
    next = current + page;
  } else if (keys.pages && key === 'PageDown') {
    next = current - page;
  } else if (keys.edges && key === 'Home') {
    next = 0;
  } else if (keys.edges && key === 'End') {
    next = max;
  }

  return next === undefined ? undefined : Math.min(max, Math.max(0, next));
}

interface ColorPickerListener {
  event: PickerListenerEvent;
  value?: string;
}

interface PickerColorProps extends RlsComponent {
  color?: string;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, string>
    | ReactControl<HTMLElement, string | undefined>;
  onListener?: (listener: ColorPickerListener) => void;
}

function RlsPickerColorComponent({
  color,
  disabled,
  formControl,
  rlsSize,
  onListener,
  rlsTheme
}: PickerColorProps) {
  const initialColor = useMemo(
    () => formControl?.value ?? color ?? DEFAULT_COLOR,
    []
  );

  const initialHsv = useMemo(
    () => hexToHsv(initialColor) ?? { h: 258, s: 100, v: 100 },
    []
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const selectionIsActive = useRef(false);
  const activeSlider = useRef<'canvas' | 'hue' | 'alpha' | null>(null);
  const hexEditing = useRef(false);

  const [hsv, setHsv] = useState<HSV>(initialHsv);
  const [alpha, setAlpha] = useState(1);
  const [hexInput, setHexInput] = useState(initialColor);

  const [labels, setLabels] = useState({
    colorActionCancel: reactI18n('dateActionCancel'),
    colorActionSelect: reactI18n('dateActionSelect'),
    colorAlpha: reactI18n('colorAlpha'),
    colorBrightness: reactI18n('colorBrightness'),
    colorHue: reactI18n('colorHue'),
    colorSaturation: reactI18n('colorSaturation')
  });

  const hexColor = useMemo(() => hsvToHex(hsv), [hsv]);

  const hexValue = useMemo(() => {
    return hexInput.replace('#', '');
  }, [hexInput]);

  const canvasStyle = useMemo(() => {
    const { r, g, b } = hsvToRgb({ h: hsv.h, s: 100, v: 100 });

    return {
      background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), rgb(${r}, ${g}, ${b})`
    };
  }, [hsv.h]);

  const indicatorPosition = useMemo(() => {
    return {
      left: `${(hsv.s / 100) * 100}%`,
      top: `${100 - (hsv.v / 100) * 100}%`
    };
  }, [hsv.s, hsv.v]);

  const hueSliderStyle = useMemo(() => {
    return {
      background:
        'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
    };
  }, []);

  const hueIndicatorStyle = useMemo(() => {
    return { left: `${(hsv.h / 360) * 100}%`, backgroundColor: hexColor };
  }, [hsv.h, hexColor]);

  const alphaSliderStyle = useMemo(() => {
    return {
      background: `linear-gradient(to right, transparent, ${hexColor})`
    };
  }, [hexColor]);

  const alphaIndicatorStyle = useMemo(() => {
    return { left: `${alpha * 100}%`, backgroundColor: hexColor };
  }, [alpha, hexColor]);

  useEffect(() => {
    if (!hexEditing.current) {
      setHexInput(hexColor);
    }
  }, [hexColor]);

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabels({
        colorActionCancel: reactI18n('dateActionCancel'),
        colorActionSelect: reactI18n('dateActionSelect'),
        colorAlpha: reactI18n('colorAlpha'),
        colorBrightness: reactI18n('colorBrightness'),
        colorHue: reactI18n('colorHue'),
        colorSaturation: reactI18n('colorSaturation')
      });
    });
  }, []);

  const getPositionInElement = useCallback(
    (element: HTMLElement, clientX: number, clientY: number) => {
      const rect = element.getBoundingClientRect();

      return {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height
      };
    },
    []
  );

  const updateColorOnCanvas = useEventCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return;

      const pos = getPositionInElement(canvasRef.current, clientX, clientY);

      setHsv((prev) => ({
        ...prev,
        s: Math.round(Math.min(1, Math.max(0, pos.x)) * 100),
        v: Math.round(Math.min(1, Math.max(0, 1 - pos.y)) * 100)
      }));
    }
  );

  const updateHueOnSlider = useEventCallback(
    (clientX: number, clientY: number) => {
      if (!hueRef.current) return;

      const pos = getPositionInElement(hueRef.current, clientX, clientY);

      setHsv((prev) => ({
        ...prev,
        h: Math.round(Math.min(1, Math.max(0, pos.x)) * 360)
      }));
    }
  );

  const updateAlphaOnSlider = useEventCallback(
    (clientX: number, clientY: number) => {
      if (!alphaRef.current) return;

      const pos = getPositionInElement(alphaRef.current, clientX, clientY);

      setAlpha(Math.min(1, Math.max(0, pos.x)));
    }
  );

  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const slider = (event.currentTarget as HTMLElement).dataset.slider as
        | 'canvas'
        | 'hue'
        | 'alpha';

      if (!slider) return;

      event.preventDefault();
      selectionIsActive.current = true;
      activeSlider.current = slider;

      switch (slider) {
        case 'canvas':
          updateColorOnCanvas(event.clientX, event.clientY);
          break;
        case 'hue':
          updateHueOnSlider(event.clientX, event.clientY);
          break;
        case 'alpha':
          updateAlphaOnSlider(event.clientX, event.clientY);
          break;
      }
    },
    [updateColorOnCanvas, updateHueOnSlider, updateAlphaOnSlider]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!selectionIsActive.current || !activeSlider.current) return;

      event.preventDefault();

      switch (activeSlider.current) {
        case 'canvas':
          updateColorOnCanvas(event.clientX, event.clientY);
          break;
        case 'hue':
          updateHueOnSlider(event.clientX, event.clientY);
          break;
        case 'alpha':
          updateAlphaOnSlider(event.clientX, event.clientY);
          break;
      }
    },
    [updateColorOnCanvas, updateHueOnSlider, updateAlphaOnSlider]
  );

  const onTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const slider = (event.currentTarget as HTMLElement).dataset.slider as
        | 'canvas'
        | 'hue'
        | 'alpha';

      if (!slider) return;

      const touch = event.touches.item(0);
      if (!touch) return;

      selectionIsActive.current = true;
      activeSlider.current = slider;

      switch (slider) {
        case 'canvas':
          updateColorOnCanvas(touch.clientX, touch.clientY);
          break;
        case 'hue':
          updateHueOnSlider(touch.clientX, touch.clientY);
          break;
        case 'alpha':
          updateAlphaOnSlider(touch.clientX, touch.clientY);
          break;
      }
    },
    [updateColorOnCanvas, updateHueOnSlider, updateAlphaOnSlider]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touch = event.touches.item(0);

      if (!selectionIsActive.current || !activeSlider.current || !touch) return;

      switch (activeSlider.current) {
        case 'canvas':
          updateColorOnCanvas(touch.clientX, touch.clientY);
          break;
        case 'hue':
          updateHueOnSlider(touch.clientX, touch.clientY);
          break;
        case 'alpha':
          updateAlphaOnSlider(touch.clientX, touch.clientY);
          break;
      }
    },
    [updateColorOnCanvas, updateHueOnSlider, updateAlphaOnSlider]
  );

  const onKeyDownSlider = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      const slider = event.currentTarget.dataset.slider as
        | 'canvas'
        | 'hue'
        | 'alpha'
        | undefined;

      if (!slider) return;

      const step = event.shiftKey ? 10 : 1;

      switch (slider) {
        case 'canvas': {
          const saturation = valueFromKey(
            event.key,
            hsv.s,
            100,
            step,
            10,
            HORIZONTAL_KEYS
          );
          const brightness = valueFromKey(
            event.key,
            hsv.v,
            100,
            step,
            10,
            VERTICAL_KEYS
          );

          if (saturation === undefined && brightness === undefined) return;

          event.preventDefault();

          setHsv((prev) => ({
            ...prev,
            s: saturation ?? prev.s,
            v: brightness ?? prev.v
          }));
          break;
        }

        case 'hue': {
          const hue = valueFromKey(
            event.key,
            hsv.h,
            360,
            step,
            36,
            LINEAR_KEYS
          );

          if (hue === undefined) return;

          event.preventDefault();
          setHsv((prev) => ({ ...prev, h: hue }));
          break;
        }

        case 'alpha': {
          const next = valueFromKey(
            event.key,
            Math.round(alpha * 100),
            100,
            step,
            10,
            LINEAR_KEYS
          );

          if (next === undefined) return;

          event.preventDefault();
          setAlpha(next / 100);
          break;
        }
      }
    },
    [disabled, hsv, alpha]
  );

  const onInactiveSelection = useCallback(() => {
    selectionIsActive.current = false;
    activeSlider.current = null;
  }, []);

  const onHexChange = useCallback((value: string) => {
    setHexInput(value);

    const normalized = normalizeHex(value);

    if (normalized) {
      const hsv = hexToHsv(normalized);

      if (hsv) {
        setHsv(hsv);
      }
    }
  }, []);

  const onHexFocus = useCallback(() => {
    hexEditing.current = true;
  }, []);

  const onHexBlur = useEventCallback(() => {
    hexEditing.current = false;

    const normalized = normalizeHex(hexInput);

    if (normalized) {
      setHexInput(normalized);
    } else {
      setHexInput(hexColor);
    }
  });

  const onHexKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onHexBlur();
      }
    },
    [onHexBlur]
  );

  const onHexInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onHexChange(event.target.value ? `#${event.target.value}` : ''),
    [onHexChange]
  );

  const onCancel = useCallback(() => {
    onListener?.({ event: PickerListenerEvent.Cancel });
  }, [onListener]);

  const onSelect = useCallback(() => {
    formControl?.setValue(hexColor);
    onListener?.({ event: PickerListenerEvent.Select, value: hexColor });
  }, [formControl, hexColor, onListener]);

  return (
    <div className="rls-picker-color" rls-size={rlsSize} rls-theme={rlsTheme}>
      <div className="rls-picker-color__preview">
        <div
          ref={canvasRef}
          className="rls-picker-color__canvas"
          style={canvasStyle}
          data-slider="canvas"
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={labels.colorSaturation}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hsv.s}
          aria-valuetext={`${labels.colorSaturation} ${hsv.s}%, ${labels.colorBrightness} ${hsv.v}%`}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDownSlider}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onInactiveSelection}
          onMouseLeave={onInactiveSelection}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onInactiveSelection}
        >
          <div
            className="rls-picker-color__indicator"
            style={{
              left: indicatorPosition.left,
              top: indicatorPosition.top
            }}
          >
            <div
              className="rls-picker-color__indicator__circle"
              style={{ backgroundColor: hexColor }}
            />
          </div>
        </div>
      </div>

      <div className="rls-picker-color__controls">
        <div className="rls-picker-color__slider">
          <div
            ref={hueRef}
            className="rls-picker-color__slider__track"
            style={hueSliderStyle}
            data-slider="hue"
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={labels.colorHue}
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={hsv.h}
            aria-disabled={disabled || undefined}
            onKeyDown={onKeyDownSlider}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onInactiveSelection}
            onMouseLeave={onInactiveSelection}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onInactiveSelection}
          >
            <div
              className="rls-picker-color__slider__thumb"
              style={hueIndicatorStyle}
            />
          </div>
        </div>

        <div className="rls-picker-color__slider">
          <div
            ref={alphaRef}
            className="rls-picker-color__slider__track rls-picker-color__slider__track--alpha"
            style={alphaSliderStyle}
            data-slider="alpha"
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={labels.colorAlpha}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(alpha * 100)}
            aria-disabled={disabled || undefined}
            onKeyDown={onKeyDownSlider}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onInactiveSelection}
            onMouseLeave={onInactiveSelection}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onInactiveSelection}
          >
            <div
              className="rls-picker-color__slider__thumb"
              style={alphaIndicatorStyle}
            />
          </div>
        </div>
      </div>

      <div className="rls-picker-color__footer">
        <div className="rls-picker-color__hex">
          <div
            className="rls-picker-color__hex__swatch"
            style={{ backgroundColor: hexColor }}
          />
          <span className="rls-picker-color__hex__prefix">#</span>
          <input
            className="rls-picker-color__hex__input"
            type="text"
            maxLength={6}
            value={hexValue}
            onChange={onHexInputChange}
            onFocus={onHexFocus}
            onBlur={onHexBlur}
            onKeyDown={onHexKeyDown}
          />
        </div>
      </div>

      <div className="rls-picker-color__actions">
        <div className="rls-picker-color__actions--cancel">
          <RlsButton type="flat" onClick={onCancel}>
            {labels.colorActionCancel}
          </RlsButton>
        </div>

        <div className="rls-picker-color__actions--ok">
          <RlsButton type="raised" onClick={onSelect}>
            {labels.colorActionSelect}
          </RlsButton>
        </div>
      </div>
    </div>
  );
}

export const RlsPickerColor = memo(RlsPickerColorComponent);
