import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ProfileBox } from './style/DrawerProfileStyle';
import { useNavigate } from 'react-router-dom';
import { LocalUser } from '../../service/local.service';
import { useDispatch } from 'react-redux';
import { clearChatState, clearSelectedConversation } from '../../redux/conversationSlice';
import UserProfileDrawer from './UserProfileDrawer';
import { useState } from 'react';

export const DrawerProfile = ({ toggleDrawer, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add state to control profile drawer
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('token');
    if (typeof LocalUser?.clearCurrentUser === 'function') {
      LocalUser.clearCurrentUser();
    }

    dispatch(clearSelectedConversation());
    dispatch(clearChatState());
    navigate('/');
  };

  return (
    <>
      <Box sx={{ width: 370 }} role="presentation">
        {/* Header with back arrow */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1.5}
        >
          <IconButton edge="start" onClick={() => toggleDrawer(false)()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Hồ sơ
          </Typography>
          <Box width={40} /> {/* Empty box to balance layout */}
        </Box>

        {/* Profile info */}
        <ProfileBox>
          <Avatar src={user?.avatar || undefined}>
            {(!user?.avatar && user?.username) ? user.username.charAt(0).toUpperCase() : null}
          </Avatar>
          <Typography variant="subtitle1">
            {user?.username || 'Unknown User'}
          </Typography>
        </ProfileBox>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenProfileDrawer(true)}> {/* ✅ Open drawer */}
              <ListItemText primary="Trang cá nhân" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Box>
      </Box>

      {/* Inner profile drawer */}
      <UserProfileDrawer
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
        user={user}
      />
    </>
  );
};
