import styled from "styled-components";
import { Box, ListItemButton } from '@mui/material';

const SidebarStyle = styled(Box)`
  width: 300px;
  height: 100vh;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const SearchBarStyle = styled(Box)`
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const ConversationListStyle = styled(Box)`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ConversationItemStyle = styled(Box)`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;

  &:hover {
    background-color: #eee;
  }
`;

const UserBoxStyle = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  gap: 20px;
  width: 100%;
`;

const ListItem = styled(Box)`
    padding: 1px 10px;
    &:hover {
        background-color: #e0e0e0;
    }
    &.Mui-selected {
        background-color: #d0d0d0;
    }
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const BoxList = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1px 10px;
`;

export { SidebarStyle, SearchBarStyle, ConversationListStyle, ConversationItemStyle, UserBoxStyle, ListItem, BoxList };