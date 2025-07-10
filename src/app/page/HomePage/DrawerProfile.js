import { Box, List, ListItem, ListItemButton, ListItemText, Divider, Avatar, Typography } from '@mui/material';
import { ProfileBox } from './style/DrawerProfileStyle';

export const DrawerProfile = ({ toggleDrawer, user }) => {
  return (
    <Box sx={{ width: 310 }} role="presentation" onClick={toggleDrawer(false)}>
      <ProfileBox>
        <Avatar src={user?.avatar || 'https://via.placeholder.com/150'} />
        <Typography variant="subtitle1">
          {user?.name || 'Unknown User'}
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
    </Box>
  );
}
