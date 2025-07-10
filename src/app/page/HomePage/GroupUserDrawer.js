import {
  Drawer,
  Typography,
  List,
  Avatar,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu, 
  MenuItem
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LocalGroupUsers } from '../../service/local.service';
import { deleteGroup } from '../../service/remote-service/group.service'; // Make sure this is defined in your API
import { deleteUserFromGroup } from '../../service/remote-service/groupUser.service';
import {fetchAndSaveGroups} from '../../service/remote-service/group.service'
import EditGroupNameDrawer from './EditGroupNameDrawer';
import AddUserDrawer from './AddUserDrawer';
import {
  DrawerContent,
  GroupHeader,
  UserListItem
} from './style/GroupUserDrawerStyle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const GroupUsersDrawers = ({ open, onClose, groupId, initialGroupData, onGroupNameChange, onGroupsUpdated }) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLocalUsers = async () => {
      const groupUserList = await LocalGroupUsers.getGroupUsersByGroupId(groupId);
      const users = Array.isArray(groupUserList) ? groupUserList : groupUserList?.groupUsers || [];
      setGroupUsers(users);

      const currentUserEmail = localStorage.getItem("currentUserEmail");
      const matched = users.find(
        u => u.email?.toLowerCase() === currentUserEmail?.toLowerCase()
      );

      const isAdmin = matched?.role === 'admin';
      setIsAdmin(isAdmin);
    };

    if (open && groupId) {
      fetchLocalUsers();
    }
  }, [open, groupId]);

  const handleGroupNameChange = (newName) => {
    onGroupNameChange?.(newName);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteGroup(groupId);
    if (result.success) {
      setDeleteDialogOpen(false);
      onClose(); // Close the drawer
      alert('Nhóm đã được xóa.');
    } else {
      alert(result.error || 'Không thể xóa nhóm.');
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !groupId) return;

    try {
      const res = await deleteUserFromGroup(groupId, selectedUser.user_id);
      if (res.success) {
        // Refetch all groups and update local DB
        const refresh = await fetchAndSaveGroups();
        if (!refresh.success) {
          console.warn('Refetching groups failed:', refresh.error);
        }

        // Optional: notify parent component to update its group list
        if (typeof onGroupsUpdated === 'function') {
          onGroupsUpdated(refresh.groups || []);
        }
      } else {
        alert(res.error || 'Xóa thành viên thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi xóa thành viên');
    } finally {
      handleMenuClose();
    }
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
            {isAdmin && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => setAddUserOpen(true)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* User List */}
          {Array.isArray(groupUsers) && groupUsers.length > 0 ? (
            <List>
              {groupUsers.map((user) => (
                <UserListItem
                  key={user.user_id}
                  sx={{
                    position: 'relative',
                    '&:hover .more-actions': {
                      opacity: 1,
                      visibility: 'visible'
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                    {(user.full_name || user.username || 'U')?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box flex="1">
                    <Typography variant="subtitle2">
                      {user.full_name || user.username || user.user_id}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Role: {user.role}
                    </Typography>
                  </Box>

                  {isAdmin && user.role !== 'admin' && (
                    <IconButton
                      className="more-actions"
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </UserListItem>
              ))}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDeleteUser}>Xóa người dùng</MenuItem>
              </Menu>
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No members found in this group.
            </Typography>
          )}

          {/* Delete Button (only for admin) */}
          {isAdmin && (
            <Box mt={3}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                fullWidth
                onClick={() => setDeleteDialogOpen(true)}
              >
                Xóa nhóm
              </Button>
            </Box>
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
        onClose={() => setAddUserOpen(false)}
        groupId={groupId}
        onUserAdded={() => {
          setAddUserOpen(false);
          LocalGroupUsers.getGroupUsersByGroupId(groupId).then((res) => {
            const users = Array.isArray(res) ? res : res?.groupUsers || [];
            setGroupUsers(users);
          });
        }}
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupUsersDrawers;
