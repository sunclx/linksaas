import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import s from './index.module.less';
import ActionModal from '../ActionModal';
import classNames from 'classnames';
import { useStores } from '@/hooks';

type ProfileType = {
  defaultSrc?: string;
  visible: boolean;
  onOK?: (imgData: string | null) => void;
  onCancel?: () => void;
};

export const Profile: React.FC<ProfileType> = ({ visible, onCancel, onOK, defaultSrc }) => {
  const appStore = useStores('appStore');

  let imageSrc = defaultSrc ?? '';
  if (appStore.isOsWindows) {
    imageSrc = imageSrc.replace('fs://localhost/', 'https://fs.localhost/');
  }
  if (imageSrc == '') {
    imageSrc = '/default_av.jpg';
  }
  const [image, setImage] = useState(imageSrc);
  const [cropper, setCropper] = useState<any>();

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = (): string | null => {
    if (typeof cropper !== 'undefined') {
      return cropper
        .getCroppedCanvas()
        .toDataURL('image/png')
        .replace(/^data:image\/[a-z]+;base64,/, '');
    }
    return null;
  };

  return (
    <ActionModal
      visible={visible}
      width={500}
      style={{ padding: 0 }}
      okText="上传"
      onOK={() => onOK?.(getCropData())}
      onCancel={onCancel}
    >
      <div className={s.profile_wrap}>
        <label title="上传图片" className={s.update_btn}>
          <input
            type="file"
            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
            name="file"
            onChange={onChange}
            style={{ display: 'none' }}
          />
          选择图片
        </label>

        <div className={s.profile_contnet_wrap}>
          <Cropper
            style={{ height: 300, width: '80%', border: '1px solid #ddd', marginRight: '10px' }}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={true}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
          <div>
            <h1>图片预览：</h1>
            <div className={classNames('img-preview', s.img_preview)} />
          </div>
        </div>
      </div>
    </ActionModal>
  );
};

export default Profile;
