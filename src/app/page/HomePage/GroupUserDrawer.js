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
import {
  deleteGroup,
  fetchAndSaveGroups
} from '../../service/remote-service/group.service';
import {
  deleteUserFromGroup,
  fetchAndSaveGroupUsers
} from '../../service/remote-service/groupUser.service';

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
import { useDispatch } from 'react-redux';
import { setSelectedConversation } from '../../redux/conversationSlice';

const GroupUsersDrawers = ({
  open,
  onClose,
  groupId,
  initialGroupData,
  onGroupNameChange,
  onGroupsUpdated
}) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!groupId) return;

      await fetchAndSaveGroupUsers(groupId); // Sync latest

      const groupUserList = await LocalGroupUsers.getGroupUsersByGroupId(groupId);
      const users = Array.isArray(groupUserList)
        ? groupUserList
        : groupUserList?.groupUsers || [];
      setGroupUsers(users);

      const currentUserEmail = localStorage.getItem("currentUserEmail");
      const matched = users.find(
        u => u.email?.toLowerCase() === currentUserEmail?.toLowerCase()
      );
      setIsAdmin(matched?.role === 'admin');
    };

    if (open && groupId) {
      fetchUsers();
    }
  }, [open, groupId]);

  const handleGroupNameChange = (newName) => {
    onGroupNameChange?.(newName);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteGroup(groupId);
    if (result.success) {
      const sync = await fetchAndSaveGroups();

      // ✅ Only clear selection when group is deleted
      dispatch(setSelectedConversation(null));

      onGroupsUpdated?.(sync.groups || []);
      setDeleteDialogOpen(false);
      onClose();
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
        await fetchAndSaveGroupUsers(groupId);
        const groupUserList = await LocalGroupUsers.getGroupUsersByGroupId(groupId);
        const users = Array.isArray(groupUserList)
          ? groupUserList
          : groupUserList?.groupUsers || [];
        setGroupUsers(users);

        // ✅ DO NOT clear selected group or call onGroupsUpdated
        // Group is still valid
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
      <Drawer anchor="right" open={open} onClose={onClose} ModalProps={{ keepMounted: false }}>
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
                    {(user.username || 'U')?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box flex="1">
                    <Typography variant="subtitle2">
                      { user.username || user.user_id}
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

      <EditGroupNameDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        groupId={groupId}
        initialName={initialGroupData?.name || ''}
        onGroupNameChange={handleGroupNameChange}
      />

      <AddUserDrawer
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        groupId={groupId}
        onUserAdded={async () => {
          setAddUserOpen(false);
          const sync = await fetchAndSaveGroupUsers(groupId);
          const users = sync?.groupUsers || [];
          setGroupUsers(users);
        }}
      />

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
