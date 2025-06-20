import { Box, Avatar, Typography } from "@mui/material";
import { ListItem, ConversationItemStyle, ConversationListStyle } from "./style/SidebarStyle"
import { useNavigate } from "react-router-dom";

export const ChatList = ({ conversations }) => {
    const navigate = useNavigate();
    const handleConversationClick = (conversationId) => {
        navigate(`/group/${conversationId}`);
    };
    return (
            <ConversationListStyle>
                {(Array.isArray(conversations) ? conversations : []).map((conversation) => (
                    <ConversationItemStyle
                        key={conversation.id}
                        onClick={() => handleConversationClick(conversation.id)}
                    >
                        <Avatar src={conversation.avatar} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1">
                            {conversation.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                            {conversation.lastMessage}
                            </Typography>
                        </Box>
                    </ConversationItemStyle>
                ))}
            </ConversationListStyle>
    );
}