import { Box } from '@mui/material';
import { styled } from 'styled-components';


// Styled box for Home component
const MainBox = styled(Box)`
    display: flex;
    height: 100vh;
`;

const LeftBox = styled(Box)`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const RightBox = styled(Box)`
    flex: 2;
    background-image: url("desktop.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    backgrpund-color: #3CC0F0;
`;

const FormContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 400px;
    width: 100%;
`;

export { MainBox, LeftBox, RightBox, FormContainer };

//Styled box for Signin components