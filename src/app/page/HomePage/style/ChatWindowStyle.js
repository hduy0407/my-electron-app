import { Paper, Box, Container } from '@mui/material';
import {styled} from 'styled-components'

export const MainContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    height: 100vh;
  `;

export const MessagesContainer = styled(Box)`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing(2)};
`;

export const MessageWrapper = styled(Box)`
    display: flex;
    justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
    margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const MessageBubble = styled(Paper)`
    padding: ${({ theme }) => theme.spacing(1, 2)};
    max-width: 70%;
    background-color: ${props => props.isUser ? '#1976d2' : '#f5f5f5'};
    color: ${props => props.isUser ? '#fff' : '#000'};
`;

export const InputContainer = styled(Box)`
    padding: ${({ theme }) => theme.spacing(2)}px;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
    padding-bottom: 10px;
`;

