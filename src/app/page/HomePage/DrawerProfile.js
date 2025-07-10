import { Box, List, ListItem, ListItemButton, ListItemText, Divider, Avatar, Typography, Button } from '@mui/material';
import { ProfileBox } from './style/DrawerProfileStyle';
import { useNavigate } from 'react-router-dom';
import { LocalUser } from '../../service/local.service';

export const DrawerProfile = ({ toggleDrawer, user }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.stopPropagation(); // Prevent drawer from closing when clicking logout
    localStorage.removeItem('token');
    if (typeof LocalUser?.clearCurrentUser === 'function') {
      LocalUser.clearCurrentUser();
    }
    console.log('User logged out successfully');
    console.log('LoclalUser after logout:', LocalUser.getCurrentUser());
    navigate('/');
  };

  return (
    <Box sx={{ width: 310 }} role="presentation" onClick={() => toggleDrawer(false)}>
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
          <ListItemButton>
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
  );
}
