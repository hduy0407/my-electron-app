import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { createGroup } from '../../service/remote-service/group.service';
import { getAllUsers } from '../../service/remote-service/groupUser.service';
import {
  DrawerContainer,
  Header,
  UploadButton,
  HiddenInput,
  AvatarPreview,
  AvatarWrapper,
  StyledArrowBackIcon,
  StyledIconButton
} from './style/CreateGroupStyle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export const CreateGroupDrawer = ({ toggleDrawer, onGroupCreated }) => {
  const [avatarSrc, setAvatarSrc] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const currentUserEmail = localStorage.getItem('currentUserEmail');

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.success) {
        // Exclude the current user from the list by email
        const filteredUsers = result.users.filter(
          (user) => user.email !== currentUserEmail
        );
        setUsers(filteredUsers);
      } else {
        alert('Lỗi khi tải danh sách người dùng');
      }
      setUsersLoading(false);
    };

    fetchUsers();
  }, [currentUserEmail]);

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

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Tên nhóm không được để trống!');
      return;
    }

    const usersPayload = selectedUserIds.map((id) => ({
      userId: id,
      role: 'MEMBER'
    }));

    const groupData = {
      name: groupName,
      thumbnail: avatarSrc,
      users: usersPayload
    };

    setLoading(true);

    const result = await createGroup(groupData);

    if (result.success) {
      const newGroup = Array.isArray(result.groups)
        ? result.groups[0]
        : result.group || result.groups;

      if (onGroupCreated && newGroup) {
        onGroupCreated(newGroup); 
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton edge="start" onClick={() => toggleDrawer(false)()}>
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', marginRight: '40px' }}
          >
            Tạo nhóm mới
          </Typography>

          <Box width="40px" /> {/* Filler to balance space */}
        </Box>
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

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          textAlign: 'start',
          mt: 2,
          mb: 1
        }}
      >
        Chọn thành viên:
      </Typography>
      {usersLoading ? (
        <CircularProgress size={24} />
      ) : (
        <List dense sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={() => toggleUserSelection(user.id)}
                  checked={selectedUserIds.includes(user.id)}
                />
              }
            >
              <ListItemAvatar>
                <Avatar>{user.fullName?.[0] || user.username?.[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.fullName || user.username}
                secondary={user.username}
              />
            </ListItem>
          ))}
        </List>
      )}

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
