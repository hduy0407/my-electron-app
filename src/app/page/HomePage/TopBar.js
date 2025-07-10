import { AppBar, Toolbar, Typography, Avatar, IconButton, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const TopBar = ({ group, onInfoClick }) => {
  const groupName = group?.name || 'Unnamed Group';
  const groupAvatar = group?.avatar;

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Group Logo and Name */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            flexGrow: 1,
            backgroundColor: 'white',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Avatar
            src={groupAvatar}
            alt={groupName}
            sx={{ width: 40, height: 40 }}
          >
            {(!groupAvatar && groupName) ? groupName.charAt(0).toUpperCase() : null}
          </Avatar>

          <Typography variant="h6" noWrap>
            {groupName}
          </Typography>
        </Box>

        {/* Info Button */}
        <IconButton edge="end" onClick={onInfoClick}>
          <InfoOutlinedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
