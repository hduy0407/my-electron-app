import { Box, Avatar, Typography } from "@mui/material";
import { ConversationItemStyle, ConversationListStyle } from "./style/SidebarStyle";
import { useEffect, useState } from "react";
import { LocalUser } from "../../service/local.service";

export const ChatList = ({ conversations, onSelect, selectedConversationId }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await LocalUser.getCurrentUser();
      if (res?.success) setCurrentUserId(res.user.id);
    };
    fetchCurrentUser();
  }, []);

  const handleConversationClick = (conversation) => {
    if (onSelect) onSelect(conversation);
  };

  const sortedConversations = (Array.isArray(conversations) ? conversations : [])
    .filter(Boolean)
    .sort((a, b) => {
      const timeA = new Date(a.lastMessageTime || a.created_at || 0).getTime();
      const timeB = new Date(b.lastMessageTime || b.created_at || 0).getTime();
      return timeB - timeA;
    });

  const getMessagePrefix = (conversation) => {
    if (!conversation.lastMessage) return '';
    if (conversation.lastMessageUserId === currentUserId) return 'You: ';
    if (conversation.lastMessageUsername) return `${conversation.lastMessageUsername}: `;
    return '';
  };

  return (
    <ConversationListStyle>
      {sortedConversations.map((conversation) => (
        <ConversationItemStyle
          key={conversation.id}
          onClick={() => handleConversationClick(conversation)}
          $selected={conversation.id === selectedConversationId}
        >

          <Avatar src={conversation.avatar || ''} alt={conversation.name}>
            {!conversation.avatar && conversation.name ? conversation.name.charAt(0).toUpperCase() : null}
          </Avatar>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1">
              {conversation.name || 'Unnamed Group'}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              noWrap
              sx={{
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conversation.lastMessage
                ? `${getMessagePrefix(conversation)}${conversation.lastMessage}`
                : 'new conversation'}
            </Typography>
          </Box>
        </ConversationItemStyle>
      ))}
    </ConversationListStyle>
  );
};
