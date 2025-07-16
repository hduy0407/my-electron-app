import {
  Typography,
  TextField,
  Stack,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {
  MainContainer,
  MessagesContainer,
  MessageWrapper,
  MessageBubble,
  InputContainer,
  TopBarWrapper,
  HoverMeta,
  
} from './style/ChatWindowStyle';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LocalPosts,
  LocalUser,
  LocalGroupUsers,
} from '../../service/local.service';
import { createPost, updatePost } from '../../service/remote-service/post.service';
import TopBar from './TopBar';
import GroupUsersDrawer from './GroupUserDrawer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { setSelectedConversation } from '../../redux/conversationSlice';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';



const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const ChatWindow = ({ refreshKey = 0, onGroupUpdated }) => {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const dispatch = useDispatch();

  const [messagesByGroup, setMessagesByGroup] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prevConversationIdRef = useRef(null);
  const [groupUsers, setGroupUsers] = useState({});
  const [inputFocused, setInputFocused] = useState(false);

  // Edit dialog state
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState('');

  const currentMessages =
    selectedConversation?.id && messagesByGroup[selectedConversation.id]
      ? messagesByGroup[selectedConversation.id]
      : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadUser = async () => {
      const res = await LocalUser.getCurrentUser();
      if (res?.success) setCurrentUser(res.user);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      if (!selectedConversation?.id) return;
      const res = await LocalGroupUsers.getGroupUsersByGroupId(
        selectedConversation.id
      );
      if (res?.success && Array.isArray(res.groupUsers)) {
        setGroupUsers((prev) => ({
          ...prev,
          [selectedConversation.id]: res.groupUsers,
        }));
      }
    };
    fetchGroupUsers();
  }, [selectedConversation?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?.id || !currentUser) return;

      const res = await LocalPosts.getPostsByGroupId(selectedConversation.id);
      const posts = res?.posts || res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(posts)) {
        const existing = messagesByGroup[selectedConversation.id] || [];
        const hasPending = existing.some((m) => m.isPending);
        if (hasPending) return;

        const formatted = posts
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.user_id === currentUser.id ? 'user' : 'other',
            created_at: msg.created_at,
            userId: msg.user_id,
            isPending: false,
          }));

        setMessagesByGroup((prev) => ({
          ...prev,
          [selectedConversation.id]: formatted,
        }));

        if (prevConversationIdRef.current !== selectedConversation.id) {
          setTimeout(scrollToBottom, 50);
          prevConversationIdRef.current = selectedConversation.id;
        }
      }
    };
    fetchMessages();
  }, [selectedConversation, currentUser, refreshKey]);

  const handleSendMessage = async (e, customMessage = null) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage || newMessage.trim();
    if (!selectedConversation || !messageToSend || !currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      text: messageToSend,
      sender: 'user',
      isPending: true,
      created_at: new Date().toISOString(),
      userId: currentUser.id,
    };

    setMessagesByGroup((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        tempMessage,
      ],
    }));

    if (!customMessage) setNewMessage('');
    scrollToBottom();

    try {
      const requestBody = {
        title: 'Convo',
        content: messageToSend,
        userId: currentUser.id,
        groupId: selectedConversation.id,
      };

      const apiRes = await createPost(requestBody);
      const createdPost = apiRes?.post;

      if (createdPost) {
        await LocalPosts.savePost(createdPost);

        setMessagesByGroup((prev) => {
          const existing = prev[selectedConversation.id] || [];
          const updated = existing.map((msg) =>
            msg.id === tempId
              ? {
                  id: createdPost.id,
                  text: createdPost.content,
                  sender: 'user',
                  created_at: createdPost.created_at,
                  userId: currentUser.id,
                  isPending: false,
                }
              : msg
          );
          return {
            ...prev,
            [selectedConversation.id]: updated,
          };
        });

        scrollToBottom();
        onGroupUpdated?.();
      }
    } catch (err) {
      console.error('Send message failed:', err);
    }
  };

  const handleEdit = (msgId, msgText) => {
    setEditingMessageId(msgId);
    setEditContent(msgText);
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editContent.trim() || !selectedConversation || !currentUser) return;

    try {
      const apiRes = await updatePost(editingMessageId, editContent.trim());

      if (apiRes?.success && apiRes.post) {
        const updatedPost = apiRes.post;

        setMessagesByGroup((prev) => {
          const updated = prev[selectedConversation.id].map((msg) =>
            msg.id === editingMessageId
              ? {
                  ...msg,
                  text: updatedPost.content,
                  created_at: updatedPost.createdAt,
                  isPending: false,
                }
              : msg
          );
          return { ...prev, [selectedConversation.id]: updated };
        });

        setEditDialogOpen(false);
      } else {
        console.error('Update failed:', apiRes?.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Failed to save edited message:', err);
    }
  };


  if (!selectedConversation) {
    return (
      <MainContainer>
        <Typography variant="h6" align="center" mt={4}>
          Select a conversation to start chatting
        </Typography>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <TopBarWrapper>
        <TopBar
          group={{
            name: selectedConversation?.name,
            avatar: selectedConversation?.avatar,
          }}
          onInfoClick={() => setDrawerOpen(true)}
        />
      </TopBarWrapper>

      <GroupUsersDrawer
        key={selectedConversation?.id + drawerOpen}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onGroupsUpdated={() => {
          onGroupUpdated?.();
          dispatch(setSelectedConversation(null));
        }}
        groupId={selectedConversation?.id}
        initialGroupData={selectedConversation}
        onGroupNameChange={(newName) => {
          if (selectedConversation) {
            selectedConversation.name = newName;
            setMessagesByGroup((prev) => ({ ...prev }));
          }
        }}
      />

      <MessagesContainer>
        {(() => {
          const groupUserList = groupUsers[selectedConversation.id] || [];
          const userMap = {};
          groupUserList.forEach((u) => {
            userMap[u.user_id] = u;
          });

          let lastSenderId = null;
          let lastDateLabel = null;

          return currentMessages.map((message, index) => {
            const isUser = message.sender === 'user';
            const showAvatarAndName = !isUser && message.userId !== lastSenderId;
            const sender = userMap[message.userId];
            const timeString = new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            const currentDateLabel = formatDateLabel(message.created_at);
            const showDateSeparator = currentDateLabel !== lastDateLabel;
            lastDateLabel = currentDateLabel;

            if (!isUser) {
              lastSenderId = message.userId;
            }

            return (
              <Box key={message.id || index} sx={{ width: '100%' }}>
                {showDateSeparator && (
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: 'gray',
                      my: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    {currentDateLabel}
                  </Typography>
                )}

                <MessageWrapper isUser={isUser}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '100%',
                    }}
                  >
                    {showAvatarAndName && sender && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
                        <Avatar
                          src={sender.avatar || ''}
                          alt={sender.username || ''}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {sender.username || 'Người dùng'}
                        </Typography>
                      </Box>
                    )}

                    <MessageBubble isUser={isUser}>
                      <Typography variant="body1">{message.text}</Typography>
                      {message.isPending && (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            fontStyle: 'italic',
                            fontSize: '0.75rem',
                            mt: 0.5,
                          }}
                        >
                          Đang gửi...
                        </Typography>
                      )}
                    </MessageBubble>

                    <HoverMeta className="hover-meta" isUser={isUser}>
                      <Typography variant="caption">{timeString}</Typography>
                      {message.userId === currentUser?.id && (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setEditingMessageId(message.id);
                              setEditContent(message.text);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                          <Menu
                            open={Boolean(anchorEl) && editingMessageId === message.id}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                          >
                            <MenuItem onClick={() => handleEdit(message.id, message.text)}>
                              Edit
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </HoverMeta>
                  </Box>
                </MessageWrapper>
              </Box>
            );
          });
        })()}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <form onSubmit={handleSendMessage}>
        <InputContainer>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={6}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              variant="outlined"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',          
                  lineHeight: 1,
                  alignItems: 'center',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: 0,
                },
              }}
            />


            {inputFocused ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                disableElevation
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  padding: '4px',
                  backgroundColor: 'transparent',
                  color: '#1976d2',
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:active': { backgroundColor: 'transparent' },
                  '&.Mui-disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e',
                    boxShadow: 'none',
                  },
                }}
              />
            ) : (
              <IconButton
                onClick={() => handleSendMessage(null, '👍')}
                sx={{ color: '#1976d2' }}
              >
                <ThumbUpAltOutlinedIcon />
              </IconButton>
            )}
          </Stack>
        </InputContainer>
      </form>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveEditedMessage} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};
