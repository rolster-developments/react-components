import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useRef, useState } from 'react';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms';
import { ImageEditorValue, RlsImageEditor } from '../ImageEditor/ImageEditor';
import { RlsModal } from '../Modal/Modal';
import './ImageChooser.css';

interface ImageChooserProps {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, ImageEditorValue>
    | ReactControl<HTMLElement, ImageEditorValue | undefined>;
  imgQuality?: number;
  imgWidth?: number;
  onValue?: (value: ImageEditorValue) => void;
  src?: string;
}

const mimeTypeSupports = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/bmp',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

export function RlsImageChooser(props: ImageChooserProps) {
  const refInput = useRef<HTMLInputElement>(null!);

  const [labels, setLabels] = useState({
    actionCancel: reactI18n('chooserImageActionCancel')
  });

  const [src, setSrc] = useState<string>();
  const [srcEditor, setSrcEditor] = useState<string>();

  const onSelect = useCallback(() => {
    refInput.current.click();
  }, []);

  const processImage = useCallback((file: Blob) => {
    const reader = new FileReader();

    reader.onload = function () {
      setSrcEditor(reader.result as string);

      refInput.current.value = '';
    };

    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    refInput.current.onchange = () => {
      if (
        refInput.current.files &&
        mimeTypeSupports.includes(refInput.current.files[0].type)
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

  useEffect(() => {
    props.src && setSrc(props.src);
  }, [props.src]);

  const onEditorValue = useCallback(
    (image: ImageEditorValue) => {
      setSrc(image.base64);
      setSrcEditor(undefined);

      props.onValue && props.onValue(image);
    },
    [props.onValue]
  );

  const onCancel = useCallback(() => {
    setSrcEditor(undefined);
  }, []);

  return (
    <div className="rls-image-chooser">
      <div className="rls-image-chooser__avatar" onClick={onSelect}>
        {src && <img src={src} />}
      </div>

      {srcEditor && (
        <RlsModal className="rls-image-chooser__modal" visible={true}>
          <RlsImageEditor
            src={srcEditor}
            formControl={props.formControl}
            imgWidth={props.imgWidth}
            imgQuality={props.imgQuality}
            onValue={onEditorValue}
          >
            <RlsButton
              type="flat"
              rlsTheme="danger"
              onClick={onCancel}
              disabled={props.disabled}
            >
              {labels.actionCancel}
            </RlsButton>
          </RlsImageEditor>
        </RlsModal>
      )}

      <input ref={refInput} type="file" disabled={props.disabled} />
    </div>
  );
}
