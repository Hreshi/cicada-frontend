import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface AvatarChooserProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

export default function AvatarChooser(props: AvatarChooserProps) {
  const { onChange, file } = props;

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="avatar-file"
        type="file"
        onChange={onChange}
      />

      <label htmlFor="avatar-file">
        <IconButton color="primary" aria-label="upload picture" component="span">
          <Avatar src={previewUrl} />
          <PhotoCamera />
        </IconButton>
        <span>Upload Avatar</span>
      </label>
    </div>
  );
}
