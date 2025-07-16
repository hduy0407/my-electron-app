// components/chat/UserProfileDrawer.jsx

import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const genderMap = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác'
};

const formatDateFromUnix = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000); // convert seconds to ms
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const UserProfileDrawer = ({ open, onClose, user }) => {
  const genderVi = genderMap[user?.gender?.toUpperCase()] || 'Khác';

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
            Trang cá nhân
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Profile Info */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Avatar
            src={user?.avatar || undefined}
            sx={{ width: 80, height: 80 }}
          >
            {(!user?.avatar && user?.username) ? user.username.charAt(0).toUpperCase() : null}
          </Avatar>

          <Typography variant="h6">{user?.fullName || 'Chưa có tên đầy đủ'}</Typography>
          <Typography variant="body2" color="text.secondary">@{user?.username}</Typography>

          <Box mt={2} width="100%">
            {user?.email && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {user.email}
              </Typography>
            )}
            {user?.gender && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Giới tính:</strong> {genderVi}
              </Typography>
            )}
            {user?.dateOfBirth && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Ngày sinh:</strong> {formatDateFromUnix(user.dateOfBirth)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserProfileDrawer;
