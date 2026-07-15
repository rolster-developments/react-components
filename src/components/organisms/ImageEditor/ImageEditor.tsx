import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRelocationOnComponent } from '../../../controllers/RelocationOnComponentController';
import { useResize } from '../../../controllers/ResizeController';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsComponent } from '../../definitions';
import { RlsSlider } from '../../molecules/Slider/Slider';
import { ImageMymeType, ImageRatio } from '../../types';

export interface ImageEditorValue {
  base64: string;
  blob: Blob;
}

const MIN_SLIDER_VALUE = 50;
const MAX_SLIDER_VALUE = 100;

interface ImageEditorProps extends RlsComponent {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, ImageEditorValue>
    | ReactControl<HTMLElement, ImageEditorValue | undefined>;
  maxDimension?: number;
  maxWidth?: number;
  mimeType?: ImageMymeType;
  onValue?: (value: ImageEditorValue) => void;
  quality?: number;
  ratio?: ImageRatio;
  selection?: number;
  src?: string;
}

function getRatioFactor(ratio: ImageRatio): number {
  switch (ratio) {
    case '16:9':
      return 9 / 16;
    case '8:5':
      return 5 / 8;
    case '4:3':
      return 3 / 4;
    case '3:4':
      return 4 / 3;
    case '3:2':
      return 2 / 3;
    default:
      return 1;
  }
}

function simpleThreeRule(a1: number, b1: number, a2: number): number {
  return (b1 * a2) / a1;
}

export function calculateImgDimension(
  image: HTMLImageElement,
  dimension: number
) {
  let { height, width } = image;

  if (height > width) {
    height = height > dimension ? dimension : height;
    width = simpleThreeRule(image.height, height, width);

    return { height, width };
  }

  width = width > dimension ? dimension : width;
  height = simpleThreeRule(image.width, width, height);

  return { height, width };
}

export function RlsImageEditor(props: ImageEditorProps) {
  const [selection, setSelection] = useState(props.selection ?? 60);

  const [labels, setLabels] = useState({
    actionRestore: reactI18n('editorImageActionRestore'),
    actionSelect: reactI18n('editorImageActionSelect')
  });

  const refBody = useRef<HTMLDivElement>(null!);
  const refImage = useRef<HTMLDivElement>(null!);
  const refSelection = useRef<HTMLDivElement>(null!);
  const refOverlayTop = useRef<HTMLDivElement>(null!);
  const refOverlayBottom = useRef<HTMLDivElement>(null!);
  const refOverlayLeft = useRef<HTMLDivElement>(null!);
  const refOverlayRight = useRef<HTMLDivElement>(null!);
  const refCanvas = useRef<HTMLCanvasElement>(null!);
  const refPicture = useRef<HTMLCanvasElement>(null!);

  const image = useRef(new Image());
  const originalImage = useRef<ImageData>(undefined);
  const hasInteracted = useRef(false);

  const ratio = useMemo(() => {
    return props.ratio || '1:1';
  }, [props.ratio]);

  const getCropProperties = useCallback(() => {
    return {
      height: simpleThreeRule(
        refImage.current.offsetHeight,
        image.current.height,
        refSelection.current.offsetHeight
      ),
      left: simpleThreeRule(
        refImage.current.offsetWidth,
        image.current.width,
        refSelection.current.offsetLeft
      ),
      top: simpleThreeRule(
        refImage.current.offsetHeight,
        image.current.height,
        refSelection.current.offsetTop
      ),
      width: simpleThreeRule(
        refImage.current.offsetWidth,
        image.current.width,
        refSelection.current.offsetWidth
      )
    };
  }, []);

  const refreshOverlaysStyle = useCallback(() => {
    const width = refSelection.current.offsetWidth;
    const height = refSelection.current.offsetHeight;
    const top = refSelection.current.offsetTop;
    const left = refSelection.current.offsetLeft;

    refOverlayTop.current.style.width = `${width}px`;
    refOverlayTop.current.style.bottom = `calc(100% - ${top}px)`;
    refOverlayTop.current.style.left = `${left}px`;

    refOverlayRight.current.style.left = `calc(${width + left}px)`;
    refOverlayRight.current.style.width = `calc(100% - ${width + left}px)`;

    refOverlayBottom.current.style.width = `${width}px`;
    refOverlayBottom.current.style.top = `calc(${height + top}px)`;
    refOverlayBottom.current.style.left = `${left}px`;

    refOverlayLeft.current.style.right = `calc(100% - ${left}px)`;
    refOverlayLeft.current.style.width = `calc(${left}px)`;
  }, []);

  const refreshSelectionFromWidth = useCallback(
    (rateSelection: number) => {
      const ratioFactor = getRatioFactor(ratio);
      const _ratio = rateSelection * ratioFactor;

      const offsetWidth = refImage.current?.offsetWidth || 0;
      const offsetHeight = refImage.current?.offsetHeight || 0;

      let width = (offsetWidth * rateSelection) / 100;
      let height = (offsetWidth * _ratio) / 100;

      if (height > offsetHeight) {
        height = offsetHeight;
        width = height / ratioFactor;
      }

      return { height, width };
    },
    [ratio]
  );

  const refreshSelectionFromHeight = useCallback(
    (rateSelection: number) => {
      const ratioFactor = getRatioFactor(ratio);
      const _ratio = rateSelection / ratioFactor;

      const offsetWidth = refImage.current?.offsetWidth || 0;
      const offsetHeight = refImage.current?.offsetHeight || 0;

      let height = (offsetHeight * rateSelection) / 100;
      let width = (offsetHeight * _ratio) / 100;

      if (width > offsetWidth) {
        width = offsetWidth;
        height = width * ratioFactor;
      }

      return { height, width };
    },
    [ratio]
  );

  const refreshSelectionStyle = useCallback(
    (rateSelection: number) => {
      if (
        refSelection.current &&
        image.current.width > 0 &&
        image.current.height > 0
      ) {
        const { height, width } =
          image.current.width >= image.current.height
            ? refreshSelectionFromWidth(rateSelection)
            : refreshSelectionFromHeight(rateSelection);

        refSelection.current.style.width = `${width}px`;
        refSelection.current.style.height = `${height}px`;

        const left = refImage.current.offsetWidth - width;
        const top = refImage.current.offsetHeight - height;

        if (!hasInteracted.current) {
          refSelection.current.style.left = `${left / 2}px`;
          refSelection.current.style.top = `${top / 2}px`;
        }

        if (
          refSelection.current.offsetLeft + width >
          refImage.current.offsetWidth
        ) {
          refSelection.current.style.left = `${left < 0 ? 0 : left}px`;
        }

        if (
          refSelection.current.offsetTop + height >
          refImage.current.offsetHeight
        ) {
          refSelection.current.style.top = `${top < 0 ? 0 : top}px`;
        }

        refreshOverlaysStyle();
      }
    },
    [ratio]
  );

  const setImageStyle = useCallback((width: string, height: string) => {
    refImage.current.style.width = width;
    refImage.current.style.height = height;
    refCanvas.current.style.width = width;
    refCanvas.current.style.height = height;
  }, []);

  const refreshImageStyle = useCallback(() => {
    if (image.current.width <= 0 || image.current.height <= 0) {
      return setImageStyle('0px', '0px');
    }

    const height =
      (refBody.current.offsetWidth * image.current.height) /
      image.current.width;

    if (height <= refBody.current.offsetHeight) {
      return setImageStyle('100%', `${height}px`);
    }

    const width =
      (refBody.current.offsetHeight * image.current.width) /
      image.current.height;

    return setImageStyle(`${width}px`, '100%');
  }, []);

  useEffect(() => {
    image.current.onload = () => {
      const context = refCanvas.current.getContext('2d', {
        willReadFrequently: true
      });

      const width = image.current.width;
      const height = image.current.height;

      refCanvas.current.width = width;
      refCanvas.current.height = height;

      context?.drawImage(image.current, 0, 0, width, height);
      originalImage.current = context?.getImageData(0, 0, width, height);

      refreshImageStyle();
      refreshSelectionStyle(selection);
    };

    const unsubscription = i18nSubscribe(() => {
      setLabels({
        actionRestore: reactI18n('editorImageActionRestore'),
        actionSelect: reactI18n('editorImageActionSelect')
      });
    });

    window.addEventListener('resize', refreshImageStyle);

    return () => {
      window.removeEventListener('resize', refreshImageStyle);
      unsubscription();
    };
  }, []);

  useEffect(() => {
    image.current.src = props.src || '';
  }, [props.src]);

  useEffect(() => {
    refreshSelectionStyle(selection);
  }, [ratio, selection]);

  const onResizeElement = useCallback(() => {
    refreshSelectionStyle(selection);
  }, [selection]);

  useRelocationOnComponent({
    container: refImage,
    element: refSelection,
    onDrag: () => {
      hasInteracted.current = true;
      refreshOverlaysStyle();
    }
  });

  useResize({ refElement: refImage, onResize: onResizeElement });

  const onCropImage = useCallback(() => {
    const cropProps = getCropProperties();

    const width = props.maxWidth || cropProps.width;
    const height = width * getRatioFactor(ratio);

    refPicture.current.width = width;
    refPicture.current.height = height;

    const context = refPicture.current.getContext('2d');

    context?.drawImage(
      refCanvas.current,
      cropProps.left,
      cropProps.top,
      cropProps.width,
      cropProps.height,
      0,
      0,
      width,
      height
    );

    refPicture.current.toBlob(
      (blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.readAsDataURL(blob);

          reader.onloadend = function () {
            const value: ImageEditorValue = {
              base64: reader.result as string,
              blob
            };

            props.onValue?.(value);
            props.formControl?.setValue(value);
          };
        }
      },
      props.mimeType || 'image/jpeg',
      props.quality || 1
    );
  }, [
    ratio,
    props.mimeType,
    props.onValue,
    props.formControl,
    props.maxWidth,
    props.quality
  ]);

  const onRestore = useCallback(() => {
    const context = refCanvas.current.getContext('2d');

    if (originalImage.current) {
      context?.putImageData(originalImage.current, 0, 0);
    }
  }, []);

  return (
    <div className="rls-image-editor">
      <div ref={refBody} className="rls-image-editor__body">
        <div ref={refImage} className="rls-image-editor__body__image">
          <div
            ref={refSelection}
            className="rls-image-editor__body__selection"
          ></div>

          <div
            ref={refOverlayTop}
            className="rls-image-editor__body__overlay--top"
          ></div>

          <div
            ref={refOverlayRight}
            className="rls-image-editor__body__overlay--right"
          ></div>

          <div
            ref={refOverlayBottom}
            className="rls-image-editor__body__overlay--bottom"
          ></div>

          <div
            ref={refOverlayLeft}
            className="rls-image-editor__body__overlay--left"
          ></div>

          <canvas ref={refCanvas}></canvas>
        </div>
      </div>

      <div className="rls-image-editor__footer">
        <div className="rls-image-editor__sliders">
          <RlsSlider
            prefixIcon="external-link"
            value={selection}
            minValue={MIN_SLIDER_VALUE}
            maxValue={MAX_SLIDER_VALUE}
            onValue={setSelection}
            disabled={props.disabled}
          />
        </div>

        <div className="rls-image-editor__actions">
          {props.children}

          <RlsButton
            type="flat"
            rlsTheme="standard"
            prefixIcon="refresh"
            onClick={onRestore}
            disabled={props.disabled}
          >
            {labels.actionRestore}
          </RlsButton>

          <RlsButton
            type="raised"
            rlsTheme="primary"
            prefixIcon="crop"
            onClick={onCropImage}
            disabled={props.disabled}
          >
            {labels.actionSelect}
          </RlsButton>
        </div>
      </div>

      <canvas ref={refPicture}></canvas>
    </div>
  );
}
