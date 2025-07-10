// src/style/SigninStyle.js
import { Box, Typography, TextField, Button } from '@mui/material';
import { styled } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

// Wrapper for the full page
export const PageWrapper = styled(Box)`
  display: flex;
  min-height: 100vh;
  width: 100vw;

  @media (max-width: 800px), (max-height: 600px) {
    flex-direction: column;
  }
`;

// Left section of the page
export const LeftPanel = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  background-color: #f4f6f8;

  @media (max-width: 768px), (max-height: 600px) {
    padding: 1.5rem 1rem;
  }
`;

// Right panel with background image (hidden on smaller devices)
export const RightPanel = styled(Box)`
  flex: 3;
  background-image: url('/desktop.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px), (max-height: 600px) {
    display: none;
  }
`;

// Top welcome area
export const WelcomeBox = styled(Box)`
  text-align: center;
  margin-bottom: 2rem;

  & > * {
    margin-bottom: 0.5rem;
  }

  @media (max-height: 600px) {
    margin-bottom: 1.2rem;
  }
`;

// Card-style form container
export const FormCard = styled(Box)`
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px), (max-height: 600px) {
    padding: 1.2rem;
    gap: 0.8rem;
    max-width: 95%;
  }

  @media (max-height: 500px) {
    padding: 1rem;
    gap: 0.6rem;
  }
`;

// Form title
export const FormTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 900px), (max-height: 600px) {
    font-size: 1.4rem;
  }

  @media (max-height: 500px) {
    font-size: 1.2rem;
  }
`;

// Custom styled TextField
export const StyledTextField = styled(TextField)`
  && {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 900px), (max-height: 600px) {
      font-size: 0.9rem;

      .MuiInputBase-input {
        font-size: 0.9rem;
      }

      .MuiInputLabel-root {
        font-size: 0.9rem;
      }
    }

    @media (max-height: 500px) {
      margin-top: 0.3rem;
      margin-bottom: 0.3rem;
    }
  }
`;

// Styled submit button
export const SubmitButton = styled(Button)`
  && {
    margin-top: 1rem;
    background-color: #3ca2f0;
    box-shadow: none;
    border-radius: 12px;
    font-weight: 600;
    padding: 0.75rem;
    font-size: 1rem;
    color: #fff;

    &:hover {
      background-color: #2288d7;
    }

    @media (max-width: 900px), (max-height: 600px) {
      font-size: 0.9rem;
      padding: 0.6rem;
    }

    @media (max-height: 500px) {
      font-size: 0.85rem;
      padding: 0.5rem;
    }
  }
`;

// Text under form (e.g., "Already have an account?")
export const LinkLine = styled(Typography)`
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;

  a {
    color: #3CA2F0;
    font-weight: 600;
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 900px), (max-height: 600px) {
    font-size: 0.85rem;
  }

  @media (max-height: 500px) {
    font-size: 0.8rem;
  }
`;
