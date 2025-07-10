import {
  Drawer,
  Typography,
  List,
  Avatar,
  Box,
  IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LocalGroupUsers } from '../../service/local.service';
import EditGroupNameDrawer from './EditGroupNameDrawer';
import AddUserDrawer from './AddUserDrawer'; // Import the AddUserDrawer component
import {
  DrawerContent,
  GroupHeader,
  UserListItem
} from './style/GroupUserDrawerStyle';
import AddIcon from '@mui/icons-material/Add';

const GroupUsersDrawers = ({ open, onClose, groupId, initialGroupData, onGroupNameChange }) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false); // State for AddUserDrawer

  useEffect(() => {
    const fetchLocalUsers = async () => {
      const res = await LocalGroupUsers.getGroupUsersByGroupId(groupId);
      setGroupUsers(Array.isArray(res) ? res : res?.groupUsers || []);
    };

    if (open && groupId) {
      fetchLocalUsers();
    }
  }, [open, groupId]);

  const handleGroupNameChange = (newName) => {
    onGroupNameChange?.(newName);
  };

  const groupName = initialGroupData?.name || 'Unnamed Group';
  const groupAvatar = initialGroupData?.avatar;

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <DrawerContent>
          <GroupHeader onClick={() => setEditDrawerOpen(true)}>
            <Avatar
              src={groupAvatar}
              alt={groupName}
              sx={{ width: 56, height: 56 }}
            >
              {(!groupAvatar && groupName) ? groupName.charAt(0).toUpperCase() : null}
            </Avatar>
            <Typography variant="h6">{groupName}</Typography>
          </GroupHeader>

          {/* Group Member Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              Thành viên ({groupUsers.length})
            </Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={() => setAddUserOpen(true)} // Open AddUserDrawer when clicked
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* User List */}
          {Array.isArray(groupUsers) && groupUsers.length > 0 ? (
            <List>
              {groupUsers.map((user) => (
                <UserListItem key={user.user_id}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {(user.full_name || user.username || 'U')?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Typography variant="subtitle2">
                      {user.full_name || user.username || user.user_id}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Role: {user.role}
                    </Typography>
                  </div>
                </UserListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No members found in this group.
            </Typography>
          )}
        </DrawerContent>
      </Drawer>

      {/* Edit Group Name Drawer */}
      <EditGroupNameDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        groupId={groupId}
        initialName={initialGroupData?.name || ''}
        onGroupNameChange={handleGroupNameChange}
      />

      {/* Add User Drawer */}
      <AddUserDrawer
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)} // Close the AddUserDrawer
        groupId={groupId}
        onUserAdded={() => {
            setAddUserOpen(false);
            // ✅ Refresh the user list after a user is added
            LocalGroupUsers.getGroupUsersByGroupId(groupId).then((res) => {
                const users = Array.isArray(res) ? res : res?.groupUsers || [];
                setGroupUsers(users);
            });
        }}
      />
    </>
  );
};

export default GroupUsersDrawers;
