import React from 'react'
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer } from '../style/BoxStyle';
import { useNavigate } from 'react-router-dom';


function Home() {

    const navigate = useNavigate();

    return (
        <MainBox>
            <LeftBox>
                <FormContainer>
                    <Typography variant="h4" gutterBottom align='center'>
                        JOIN US
                    </Typography>
                    <TextField
                        label="Enter your email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        borderRadius="15px"
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#3CA2F0', '&:hover': { backgroundColor: '#2288D7' }, boxShadow: 'none',  alignSelf: 'center', borderRadius: '15px'}}
                        onClick={() => navigate('/signup')}
                    >
                        Submit
                    </Button>
                </FormContainer>
            </LeftBox>

            <RightBox />
        </MainBox>
    )
}

export default Home