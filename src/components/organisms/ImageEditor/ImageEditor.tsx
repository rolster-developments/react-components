import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRelocationOnComponent, useResize } from '../../../controllers';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsSlider } from '../../molecules';
import './ImageEditor.css';

type ImageRatio = '1:1' | '3:4' | '4:3' | '3:2' | '8:5' | '16:9';

type ImageMymeType =
  | 'image/png'
  | 'image/jpg'
  | 'image/jpeg'
  | 'image/bmp'
  | 'image/webp';

export interface ImageEditorValue {
  base64: string;
  blob: Blob;
}

interface ImageEditorProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, ImageEditorValue>;
  mimeType?: ImageMymeType;
  onValue?: (result: ImageEditorValue) => void;
  rateSelection?: number;
  ratio?: ImageRatio;
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

function simpleThreeRule(
  value1: number,
  value2: number,
  proportion: number
): number {
  return (value2 * proportion) / value1;
}

export function RlsImageEditor(props: ImageEditorProps) {
  const [selection, setSelection] = useState(props.rateSelection ?? 60);

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
  const originalImage = useRef<ImageData>();

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
      const _ratio = rateSelection * getRatioFactor(props.ratio || '1:1');

      let width = (refImage.current.offsetWidth * rateSelection) / 100;
      let height = (refImage.current.offsetWidth * _ratio) / 100;

      if (height > refImage.current.offsetHeight) {
        height = refImage.current.offsetHeight;

        width =
          (height * refImage.current.offsetHeight) /
          refImage.current.offsetHeight;
      }

      return { height, width };
    },
    [props.ratio]
  );

  const refreshSelectionFromHeight = useCallback(
    (rateSelection: number) => {
      const _ratio = rateSelection * getRatioFactor(props.ratio || '1:1');

      let height = (refImage.current.offsetHeight * rateSelection) / 100;
      let width = (refImage.current.offsetHeight * _ratio) / 100;

      if (width > refImage.current.offsetWidth) {
        width = refImage.current.offsetWidth;

        height =
          (width * refImage.current.offsetWidth) / refImage.current.offsetWidth;
      }

      return { height, width };
    },
    [props.ratio]
  );

  const refreshSelectionStyle = useCallback(
    (rateSelection: number) => {
      if (image.current.width > 0 && image.current.height > 0) {
        const { height, width } =
          image.current.width >= image.current.height
            ? refreshSelectionFromHeight(rateSelection)
            : refreshSelectionFromWidth(rateSelection);

        refSelection.current.style.width = `${width}px`;
        refSelection.current.style.height = `${height}px`;

        if (
          refSelection.current.offsetLeft + width >
          refImage.current.offsetWidth
        ) {
          const selectionLeft = refImage.current.offsetWidth - width;
          refSelection.current.style.left = `${selectionLeft}px`;
        }

        if (
          refSelection.current.offsetTop + height >
          refImage.current.offsetHeight
        ) {
          const selectionTop = refImage.current.offsetHeight - height;
          refSelection.current.style.top = `${selectionTop}px`;
        }

        refreshOverlaysStyle();
      }
    },
    [props.ratio]
  );

  const setImageStyle = useCallback((width: string, height: string) => {
    refImage.current.style.width = width;
    refImage.current.style.height = height;
    refCanvas.current.style.width = width;
    refCanvas.current.style.height = height;
  }, []);

  const refreshImageStyle = useCallback(() => {
    if (image.current.width <= 0 || image.current.height <= 0) {
      return setImageStyle('0%', '0%');
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

      refCanvas.current.width = image.current.width;
      refCanvas.current.height = image.current.height;

      context?.drawImage(
        image.current,
        0,
        0,
        image.current.width,
        image.current.height
      );

      originalImage.current = context?.getImageData(
        0,
        0,
        refCanvas.current.width,
        refCanvas.current.height
      );

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
  }, [selection]);

  const onResizeElement = useCallback(() => {
    refreshSelectionStyle(selection);
  }, [selection]);

  useRelocationOnComponent({
    container: refImage,
    element: refSelection,
    onDrag: refreshOverlaysStyle
  });

  useResize({ refElement: refImage, onResize: onResizeElement });

  const onCropImage = useCallback(() => {
    const cropProps = getCropProperties();

    const width = cropProps.width;
    const height = width * getRatioFactor(props.ratio || '1:1');

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

            props.onValue && props.onValue(value);
            props.formControl?.setValue(value);
          };
        }
      },
      props.mimeType || 'image/jpeg',
      1
    );
  }, [props.ratio, props.mimeType, props.onValue, props.formControl]);

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
            minValue={50}
            maxValue={100}
            onValue={setSelection}
            disabled={props.disabled}
          />
        </div>

        <div className="rls-image-editor__actions">
          {props.children}

          <RlsButton
            type="classic"
            prefixIcon="refresh"
            onClick={onRestore}
            disabled={props.disabled}
          >
            {labels.actionRestore}
          </RlsButton>

          <RlsButton
            type="raised"
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
