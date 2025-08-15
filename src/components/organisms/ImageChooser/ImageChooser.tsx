import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useState } from 'react';
import { useImageEditorController } from '../../../controllers/ImageEditorController';
import { ImageEditorValue } from '../ImageEditor/ImageEditor';
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

export function RlsImageChooser(props: ImageChooserProps) {
  const [src, setSrc] = useState<string>();

  const onValue = useCallback(
    (image: ImageEditorValue) => {
      setSrc(image.base64);
      props.onValue && props.onValue(image);
    },
    [props.onValue]
  );

  const { RlsImageEditorChooser, onImageChooser } = useImageEditorController({
    disabled: props.disabled,
    formControl: props.formControl,
    imgQuality: props.imgQuality,
    imgWidth: props.imgWidth,
    onValue
  });

  useEffect(() => {
    props.src && setSrc(props.src);
  }, [props.src]);

  return (
    <div className="rls-image-chooser">
      <div className="rls-image-chooser__avatar" onClick={onImageChooser}>
        {src && <img src={src} />}
      </div>

      {RlsImageEditorChooser}
    </div>
  );
}
