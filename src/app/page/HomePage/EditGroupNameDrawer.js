import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { useState } from 'react';
import { updateGroup } from '../../service/remote-service/group.service';

const EditGroupNameDrawer = ({ open, onClose, groupId, initialName }) => {
  const [name, setName] = useState(initialName || '');
  const [statusMessage, setStatusMessage] = useState('');

  const handleUpdateGroup = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatusMessage('Group name cannot be empty');
      return;
    }

    const result = await updateGroup(groupId, { name: trimmedName });
    setStatusMessage(result.success ? 'Group name updated!' : result.error);

    if (result.success) {
      onClose(); // close drawer after success
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Edit Group Name
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Group Name"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleUpdateGroup}>
              Save
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
          {statusMessage && (
            <Typography variant="body2" color="textSecondary">
              {statusMessage}
            </Typography>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
};

export default EditGroupNameDrawer;
