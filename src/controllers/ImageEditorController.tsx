import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { RlsButton } from '../components/atoms/Button/Button';
import { ImageEditorValue } from '../components/organisms/ImageEditor/ImageEditor';
import { RlsImageEditorModal } from '../components/organisms/ImageEditorModal/ImageEditorModal';
import { ImageRatio } from '../components/types';
import { MIME_TYPE_SUPPORTS } from '../constants/image-editor.constant';
import { reactI18n } from '../i18n';

interface ImageEditorControllerOptions {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, ImageEditorValue>
    | ReactControl<HTMLElement, ImageEditorValue | undefined>;
  maxWidth?: number;
  onValue?: (value: ImageEditorValue) => void;
  quality?: number;
  ratio?: ImageRatio;
  selection?: number;
}

export interface ImageEditorController {
  onImageChooser: () => void;
  RlsImageEditorChooser: ReactNode;
}

export function useImageEditorController(
  options: ImageEditorControllerOptions
): ImageEditorController {
  const refInput = useRef<HTMLInputElement>(null!);

  const [srcEditor, setSrcEditor] = useState<string>();
  const [labels, setLabels] = useState({
    actionCancel: reactI18n('chooserImageActionCancel')
  });

  const processImage = useCallback((file: Blob) => {
    const reader = new FileReader();

    reader.onload = function () {
      setSrcEditor(reader.result as string);
      refInput.current.value = '';
    };

    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    refInput.current = document.createElement('input');
    refInput.current.type = 'file';

    refInput.current.onchange = () => {
      if (
        refInput.current.files &&
        MIME_TYPE_SUPPORTS.includes(refInput.current.files[0].type)
      ) {
        processImage(refInput.current.files[0]);
      }
    };

    return i18nSubscribe(() => {
      setLabels({
        actionCancel: reactI18n('chooserImageActionCancel')
      });
    });
  }, []);

  const onEditorValue = useCallback(
    (image: ImageEditorValue) => {
      setSrcEditor(undefined);
      options.onValue && options.onValue(image);
    },
    [options.onValue]
  );

  const onCancel = useCallback(() => {
    setSrcEditor(undefined);
  }, []);

  const RlsImageEditorChooser = useMemo(() => {
    return (
      srcEditor && (
        <RlsImageEditorModal
          visible={true}
          src={srcEditor}
          formControl={options.formControl}
          maxWidth={options.maxWidth}
          quality={options.quality}
          ratio={options.ratio}
          selection={options.selection}
          onValue={onEditorValue}
        >
          <RlsButton
            type="flat"
            rlsTheme="danger"
            onClick={onCancel}
            disabled={options.disabled}
          >
            {labels.actionCancel}
          </RlsButton>
        </RlsImageEditorModal>
      )
    );
  }, [
    srcEditor,
    labels,
    options.formControl,
    options.maxWidth,
    options.quality,
    options.ratio,
    options.disabled,
    onEditorValue,
    onCancel
  ]);

  const onImageChooser = useCallback(() => {
    !options.disabled && refInput.current.click();
  }, [options.disabled]);

  return { onImageChooser, RlsImageEditorChooser };
}
