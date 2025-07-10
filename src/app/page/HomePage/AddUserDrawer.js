// src/components/chat/AddUserDrawer.jsx

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
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { searchUsersByKeyword, addUserToGroupByUserId } from '../../service/remote-service/groupUser.service';

const AddUserDrawer = ({ open, onClose, groupId, onUserAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchUsersByKeyword(searchTerm);
    if (res.success) {
      setSearchResults(res.users);
    }
    setLoading(false);
  };

  const handleAddUser = async (userId) => {
    const res = await addUserToGroupByUserId(groupId, userId);
    if (res.success) {
      onUserAdded?.(); // trigger refresh
    }
  };

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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Results */}
        <List dense>
          {searchResults.map((user) => (
            <ListItem key={user.id} secondaryAction={
              <IconButton onClick={() => handleAddUser(user.id)} edge="end" aria-label="add">
                <PersonAddIcon />
              </IconButton>
            }>
              <ListItemAvatar>
                <Avatar>
                  {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.fullName || user.username}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AddUserDrawer;
