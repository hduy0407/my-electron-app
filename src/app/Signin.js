import React from "react";
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box
                sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm" justifyContent="center">
                    <Typography variant="h2" gutterBottom>
                        SIGN IN
                    </Typography>
                    <TextField
                        label="Pasword"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#3CC0F0', '&:hover': { backgroundColor: '#28a6d3' } }}
                        onClick={() => navigate('/')}
                    >
                        Submit
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

export default Signin;