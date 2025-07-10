
import styled from 'styled-components';
import { Box, Avatar, ButtonBase } from '@mui/material';

export const DrawerContainer = styled(Box)`
  width: 300px;
  padding: 16px;
`;

export const Header = styled(Box)`
  text-align: center;
  margin-bottom: 16px;

  h2 {
    font-family: Arial, sans-serif;
    font-weight: bold;
  }
`;

export const UploadButton = styled(ButtonBase)`
  border-radius: 40px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;

  &:has(:focus-visible) {
    outline: 2px solid;
    outline-offset: 2px;
  }
`;

export const HiddenInput = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const AvatarPreview = styled(Avatar)`
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
`;

export const AvatarWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

