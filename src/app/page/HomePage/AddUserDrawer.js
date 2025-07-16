import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useEffect, useState } from 'react';
import { getAllUsers, addUserToGroupByUserId } from '../../service/remote-service/groupUser.service';
import { LocalGroupUsers } from '../../service/local.service'; // ✅ Make sure this path is correct

const AddUserDrawer = ({ open, onClose, groupId, onUserAdded }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [groupUserIds, setGroupUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedUserIds, setAddedUserIds] = useState([]);

  useEffect(() => {
    if (open) {
      loadData();
      setSearchTerm('');
      setAddedUserIds([]);
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);

    // 1. Fetch all users
    const res = await getAllUsers();

    // 2. Fetch current group users from local DB
    const localGroupUsers = await LocalGroupUsers.getGroupUsersByGroupId(groupId);
    const groupUsers = Array.isArray(localGroupUsers)
      ? localGroupUsers
      : localGroupUsers?.groupUsers || [];

    const groupUserIdsSet = new Set(groupUsers.map((user) => user.user_id));

    setGroupUserIds([...groupUserIdsSet]);

    if (res.success) {
      // 3. Filter out users already in group
      const filtered = res.users.filter((user) => !groupUserIdsSet.has(user.id));
      setAllUsers(filtered);
    }

    setLoading(false);
  };

  const handleAddUser = async (userId) => {
    if (addedUserIds.includes(userId)) return;

    const res = await addUserToGroupByUserId(groupId, userId);
    if (res.success) {
      setAddedUserIds((prev) => [...prev, userId]);
      onUserAdded?.();

      // 🔁 Optionally update available users list after adding
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    const keyword = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(keyword) ||
      user.fullName?.toLowerCase().includes(keyword)
    );
  });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        {/* Top Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">Thêm người</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên hoặc username"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Results */}
        {loading ? (
          <Box mt={2} textAlign="center">
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List dense>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  <IconButton
                    onClick={() => handleAddUser(user.id)}
                    edge="end"
                    aria-label="add"
                    disabled={addedUserIds.includes(user.id)}
                  >
                    <PersonAddIcon color={addedUserIds.includes(user.id) ? "disabled" : "action"} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>{(user.username || 'U')[0].toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={user.fullName}
                />
              </ListItem>
            ))}
            {!filteredUsers.length && !loading && (
              <Box p={2}>
                <Typography variant="body2" color="textSecondary" align="center">
                  Không tìm thấy người dùng nào phù hợp
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default AddUserDrawer;
