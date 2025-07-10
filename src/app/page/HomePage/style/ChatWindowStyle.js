import { Box, Container } from '@mui/material';
import styled from 'styled-components';

export const MainContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  height: 99vh;
  background-color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-left: 2px solid #e0e0e0;
  border-right: 2px solid #e0e0e0;
  border-bottom: 2px solid #e0e0e0;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const MessagesContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

export const MessageWrapper = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'isUser',
})`
  display: flex;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 16px;

  &:hover .hover-meta {
    opacity: 1;
  }
`;


export const MessageBubble = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'isUser',
})`
  padding: 8px 16px;
  max-width: 70%;
  border-radius: 20px;
  background-color: ${({ isUser }) => (isUser ? '#1976d2' : 'rgb(225, 225, 225)')};
  color: ${({ isUser }) => (isUser ? '#fff' : '#000')};
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap; /* ✅ allows newlines and wraps long lines */
  line-height: 1.5;
`;


export const HoverMeta = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'isUser',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #777;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;



export const InputContainer = styled(Box)`
  padding: 16px;
  padding-bottom: 10px;
  background-color: white;

  .MuiOutlinedInput-root {
    background-color: white;
    border-radius: 8px;

    fieldset {
      border: none;
    }

    &.Mui-focused {
      background-color: #e5e5e5;
    }
  }
`;

export const TopBarWrapper = styled(Box)`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  box-shadow: 0;
  border-bottom: 1px solid #e0e0e0;
`;
