
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createGroup } from '../../service/remote-service/group.service';
import {
  DrawerContainer,
  Header,
  UploadButton,
  HiddenInput,
  AvatarPreview,
  AvatarWrapper
} from './style/CreateGroupStyle';

export const CreateGroupDrawer = ({ toggleDrawer, onGroupCreated }) => {
  const [avatarSrc, setAvatarSrc] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Tên nhóm không được để trống!');
      return;
    }

    setLoading(true);

    const groupData = {
      name: groupName,
      thumbnail: avatarSrc
    };

    const result = await createGroup(groupData);

    if (result.success) {
      console.log("Group created and saved locally:", result.group);
      if (onGroupCreated) {
        onGroupCreated(result.group);
      }
      toggleDrawer(false)();
    } else {
      alert(result.error);
    }

    setLoading(false);
  };

  return (
    <DrawerContainer>
      <Header>
        <h2>Tạo nhóm mới</h2>
      </Header>

      <AvatarWrapper>
        <UploadButton component="label" role={undefined} tabIndex={-1} aria-label="Avatar image">
          <AvatarPreview alt="Upload new avatar" src={avatarSrc} />
          <HiddenInput type="file" accept="image/*" onChange={handleAvatarChange} />
        </UploadButton>
      </AvatarWrapper>

      <TextField
        label="Tên nhóm"
        variant="outlined"
        fullWidth
        margin="normal"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleCreateGroup}
        disabled={loading}
      >
        {loading ? 'Đang tạo...' : 'Tạo nhóm'}
      </Button>
    </DrawerContainer>
  );
};
