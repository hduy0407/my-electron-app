import { Box, Avatar, Typography } from "@mui/material";
import { ConversationItemStyle, ConversationListStyle } from "./style/SidebarStyle";

export const ChatList = ({ conversations, onSelect }) => {
  const handleConversationClick = (conversation) => {
    if (onSelect) onSelect(conversation);
  };

  const sortedConversations = (Array.isArray(conversations) ? conversations : [])
    .filter(Boolean)
    .sort((a, b) => {
      const timeA = new Date(a.lastMessageTime || 0).getTime();
      const timeB = new Date(b.lastMessageTime || 0).getTime();
      return timeB - timeA; // newest first
    });

  return (
    <ConversationListStyle>
      {sortedConversations.map((conversation) => (
        <ConversationItemStyle
          key={conversation.id}
          onClick={() => handleConversationClick(conversation)}
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
              {conversation.lastMessage || 'new conversation'}
            </Typography>
          </Box>
        </ConversationItemStyle>
      ))}
    </ConversationListStyle>
  );
};

