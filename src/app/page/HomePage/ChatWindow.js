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
import { useSelector } from 'react-redux';
import { LocalPosts, LocalUser, LocalGroupUsers } from '../../service/local.service';
import { createPost } from '../../service/remote-service/post.service';
import TopBar from './TopBar'; 
import GroupUsersDrawer from './GroupUserDrawer'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';


export const ChatWindow = ({refreshKey=0}) => {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const [messagesByGroup, setMessagesByGroup] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prevConversationIdRef = useRef(null);
  const [groupUsers, setGroupUsers] = useState({});


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
      console.log("selectedConversation in useEffect:", selectedConversation);
      if (!selectedConversation?.id) {
        console.warn("No selectedConversation.id found, skipping fetchGroupUsers");
        return;
      }

      const res = await LocalGroupUsers.getGroupUsersByGroupId(selectedConversation.id);
      console.log('res fetchgroup:', res);

      if (res?.success && Array.isArray(res.groupUsers)) {
        setGroupUsers((prev) => ({
          ...prev,
          [selectedConversation.id]: res.groupUsers,
        }));
      } else {
        console.warn("Failed to fetch group users:", res);
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

    const updatedMessages = [
      ...(messagesByGroup[selectedConversation.id] || []),
      newLocalMessage,
    ];

    // Set local message immediately
    setMessagesByGroup((prev) => ({
      ...prev,
      [selectedConversation.id]: updatedMessages,
    }));
    
    // Clear input immediately
    setNewMessage('');

    const requestBody = {
      title: 'Convo',
      content: newLocalMessage.text,
      userId: currentUser.id,
      groupId: selectedConversation.id,
    };

    try {
      const apiRes = await createPost(requestBody);
      const createdPost = apiRes?.post;

      if (createdPost) {
        await LocalPosts.savePost(createdPost);

        // Replace temp message with real one
        setMessagesByGroup((prev) => {
          const currentList = prev[selectedConversation.id] || [];
          const filtered = currentList.filter((m) => m.id !== tempId);
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
      // Optionally show error/toast here
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
            avatar: selectedConversation?.avatar
          }}
          onInfoClick={() => setDrawerOpen(true)}
        />
      </TopBarWrapper>

      <GroupUsersDrawer
        key={selectedConversation?.id + drawerOpen}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groupId={selectedConversation?.id}
        initialGroupData={selectedConversation} 
        onGroupNameChange={(newName) =>
          // Ensure TopBar updates with new name
          selectedConversation &&
          (selectedConversation.name = newName) &&
          // Trigger rerender by using useState if needed
          setMessagesByGroup((prev) => ({ ...prev }))
        }
      />


      <MessagesContainer>
        {(() => {
          const groupUserList = groupUsers[selectedConversation.id] || [];
          const userMap = {};
          groupUserList.forEach((u) => {
            userMap[u.user_id] = u;
          });

          let lastSenderId = null; // Declare outside map

          return currentMessages.map((message, index) => {
            const isUser = message.sender === 'user';
            const showAvatarAndName = !isUser && message.userId !== lastSenderId;

            const sender = userMap[message.userId];

            const timeString = new Date(message.created_at || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            if (!isUser) {
              lastSenderId = message.userId; // Update after checking
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
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&:active': {
                backgroundColor: 'transparent',
              },
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
