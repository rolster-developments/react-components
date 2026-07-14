import { PickerListenerEvent } from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';

import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from 'react';

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

export function RlsPickerColor({
  color,
  formControl,
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
    colorActionSelect: reactI18n('dateActionSelect')
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
    !hexEditing.current && setHexInput(hexColor);
  }, [hexColor]);

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabels({
        colorActionCancel: reactI18n('dateActionCancel'),
        colorActionSelect: reactI18n('dateActionSelect')
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

  const updateColorOnCanvas = useEffectEvent(
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

  const updateHueOnSlider = useEffectEvent(
    (clientX: number, clientY: number) => {
      if (!hueRef.current) return;

      const pos = getPositionInElement(hueRef.current, clientX, clientY);

      setHsv((prev) => ({
        ...prev,
        h: Math.round(Math.min(1, Math.max(0, pos.x)) * 360)
      }));
    }
  );

  const updateAlphaOnSlider = useEffectEvent(
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

  const onInactiveSelection = useCallback(() => {
    selectionIsActive.current = false;
    activeSlider.current = null;
  }, []);

  const onHexChange = useCallback((value: string) => {
    setHexInput(value);

    const normalized = normalizeHex(value);

    if (normalized) {
      const hsv = hexToHsv(normalized);

      hsv && setHsv(hsv);
    }
  }, []);

  const onHexFocus = useCallback(() => {
    hexEditing.current = true;
  }, []);

  const onHexBlur = useEffectEvent(() => {
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
      event.key === 'Enter' && onHexBlur();
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
    <div className="rls-picker-color" rls-theme={rlsTheme}>
      <div className="rls-picker-color__preview">
        <div
          ref={canvasRef}
          className="rls-picker-color__canvas"
          style={canvasStyle}
          data-slider="canvas"
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
          <RlsButton type="gradient" onClick={onSelect}>
            {labels.colorActionSelect}
          </RlsButton>
        </div>
      </div>
    </div>
  );
}
