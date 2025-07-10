import styled from 'styled-components';
import { Box } from '@mui/material';

export const DrawerContent = styled(Box)`
  width: 300px;
  padding: 16px;
`;

export const GroupHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  cursor: pointer;
`;

export const UserListItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;
