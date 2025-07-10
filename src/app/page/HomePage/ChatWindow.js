import {
  Typography,
  TextField,
  Stack,
  Button,
  Box,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {
  MainContainer,
  MessagesContainer,
  MessageWrapper,
  MessageBubble,
  InputContainer,
  TopBarWrapper,
  HoverMeta
} from './style/ChatWindowStyle';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LocalPosts, LocalUser, LocalGroupUsers } from '../../service/local.service';
import { createPost } from '../../service/remote-service/post.service';
import TopBar from './TopBar';
import GroupUsersDrawer from './GroupUserDrawer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { setSelectedConversation } from '../../redux/conversationSlice';

export const ChatWindow = ({ refreshKey = 0 }) => {
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
  const [groups, setGroups] = useState([]);

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
      const res = await LocalGroupUsers.getGroupUsersByGroupId(selectedConversation.id);
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
        const formatted = posts
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.user_id === currentUser.id ? 'user' : 'other',
            created_at: msg.created_at,
            userId: msg.user_id,
          }));
        setMessagesByGroup((prev) => ({
          ...prev,
          [selectedConversation.id]: formatted,
        }));
        if (prevConversationIdRef.current !== selectedConversation.id) {
          setTimeout(() => {
            scrollToBottom();
          }, 50);
          prevConversationIdRef.current = selectedConversation.id;
        }
      }
    };
    fetchMessages();
  }, [selectedConversation, currentUser, refreshKey]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim() || !currentUser) return;
    const tempId = `temp-${Date.now()}`;
    const newLocalMessage = {
      id: tempId,
      text: newMessage.trim(),
      sender: 'user',
    };
    setMessagesByGroup((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newLocalMessage,
      ],
    }));
    setNewMessage('');

    try {
      const requestBody = {
        title: 'Convo',
        content: newLocalMessage.text,
        userId: currentUser.id,
        groupId: selectedConversation.id,
      };
      const apiRes = await createPost(requestBody);
      const createdPost = apiRes?.post;

      if (createdPost) {
        await LocalPosts.savePost(createdPost);
        setMessagesByGroup((prev) => {
          const filtered = (prev[selectedConversation.id] || []).filter(
            (m) => m.id !== tempId
          );
          return {
            ...prev,
            [selectedConversation.id]: [
              ...filtered,
              {
                id: createdPost.id,
                text: createdPost.content,
                sender: 'user',
              },
            ],
          };
        });
      }
      scrollToBottom();
    } catch (err) {
      console.error('Send message failed:', err);
    }
  };

  const handleGroupsUpdated = (newGroups) => {
    setGroups(newGroups);
    // If the current group was deleted, clear the conversation
    const stillExists = newGroups.find(g => g.id === selectedConversation?.id);
    if (!stillExists) {
      dispatch(setSelectedConversation(null));
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
        onGroupsUpdated={handleGroupsUpdated}
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

          return currentMessages.map((message, index) => {
            const isUser = message.sender === 'user';
            const showAvatarAndName = !isUser && message.userId !== lastSenderId;
            const sender = userMap[message.userId];
            const timeString = new Date(message.created_at || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            if (!isUser) {
              lastSenderId = message.userId;
            }

            return (
              <MessageWrapper key={message.id || index} isUser={isUser}>
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
                  </MessageBubble>

                  <HoverMeta className="hover-meta" isUser={isUser}>
                    <Typography variant="caption">{timeString}</Typography>
                    <MoreVertIcon fontSize="small" sx={{ cursor: 'pointer' }} />
                  </HoverMeta>
                </Box>
              </MessageWrapper>
            );
          });
        })()}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <form onSubmit={handleSendMessage}>
        <InputContainer>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              variant="outlined"
              size="small"
            />
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
            >
            </Button>
          </Stack>
        </InputContainer>
      </form>
    </MainContainer>
  );
};
