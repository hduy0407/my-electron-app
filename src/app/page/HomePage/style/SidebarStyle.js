import { Box } from "@mui/material";
import styled from "styled-components";

const SidebarStyle = styled(Box)`
  width: 500px;
  height: auto;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchBarStyle = styled(Box)`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
`;

const ConversationListWrapper = styled(Box)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  opacity: 1;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateY(0);
  scrollbar-width: thin;

  &.collapsed {
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
  }
`;


const ConversationListStyle = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px;
`;

const ConversationItemStyle = styled(Box)`
  padding: 14px 12px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
  transition: background-color 0.2s ease;

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
  flex-shrink: 0;
`;

const ListItemStyle = styled(Box)`
  padding: 12px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  flex-shrink: 1;      
  min-width: 0;        
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
  &.Mui-selected {
    background-color: #d0d0d0;
  }
`;


const BoxList = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1px 10px;
  flex-shrink: 0;
  gap: 8px; 
`;


export {
  SidebarStyle,
  SearchBarStyle,
  ConversationListWrapper,
  ConversationListStyle,
  ConversationItemStyle,
  UserBoxStyle,
  ListItemStyle,
  BoxList
};
