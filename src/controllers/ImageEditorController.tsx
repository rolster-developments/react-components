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
import { MIME_TYPE_SUPPORTS } from '../constants/image-editor.constant';
import { reactI18n } from '../i18n';

interface ImageEditorControllerOptions {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, ImageEditorValue>
    | ReactControl<HTMLElement, ImageEditorValue | undefined>;
  imgQuality?: number;
  imgWidth?: number;
  onValue?: (value: ImageEditorValue) => void;
  src?: string;
}

interface ImageEditorController {
  component: ReactNode;
  onImageChooser: () => void;
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
    refInput.current.disabled = true;

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

  const component = useMemo(() => {
    return (
      srcEditor && (
        <RlsImageEditorModal
          src={srcEditor}
          formControl={options.formControl}
          imgWidth={options.imgWidth}
          imgQuality={options.imgQuality}
          onValue={onEditorValue}
          visible={true}
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
  }, [srcEditor, labels]);

  const onImageChooser = useCallback(() => {
    refInput.current.click();
  }, []);

  return { component, onImageChooser };
}
