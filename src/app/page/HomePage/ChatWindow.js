import { Typography, TextField, Button, Stack} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {MainContainer, MessagesContainer, MessageWrapper, MessageBubble, InputContainer} from "./style/ChatWindowStyle"
import { useState, useEffect, useRef } from 'react';

export const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <MainContainer>
        <MessagesContainer>
            {messages.map((message, index) => (
            <MessageWrapper key={index} isUser={message.sender === 'user'}>
                <MessageBubble isUser={message.sender === 'user'} elevation={1}>
                <Typography variant="body1">
                    {message.text}
                </Typography>
                </MessageBubble>
            </MessageWrapper>
            ))}
            <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer onSubmit={handleSendMessage}>
            <Stack direction="row" spacing={2}>
            <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                variant="outlined"
                size="small"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
            >
                Send
            </Button>
            </Stack>
        </InputContainer>
    </MainContainer>
  )
}