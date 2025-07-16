import styled from 'styled-components';
import { Box, Avatar, ButtonBase } from '@mui/material';

// Drawer container with white background and padding
export const DrawerContainer = styled(Box)`
  width: 370px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
`;

// Header: no absolute positioning, handled by flex layout in JSX
export const Header = styled(Box)`
  margin-bottom: 16px;

  h2, .MuiTypography-root {
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 20px;
    margin: 0;
  }
`;

// Upload button wrapper for avatar
export const UploadButton = styled(ButtonBase)`
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;

  &:has(:focus-visible) {
    outline: 2px solid;
    outline-offset: 2px;
  }
`;

// Hidden input for file upload
export const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
`;

// Avatar preview shown inside the upload button
export const AvatarPreview = styled(Avatar)`
  width: 80px;
  height: 80px;
  font-size: 32px;
  background-color: #ccc;
`;

// Wrapper to center the avatar upload
export const AvatarWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;
