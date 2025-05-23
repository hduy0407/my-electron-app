import React from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
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
                        SIGN UP
                    </Typography>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Pasword"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Confirm password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#3CC0F0', '&:hover': { backgroundColor: '#28a6d3' } }}
                        onClick={() => navigate('/signin')}
                    >
                        Submit
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

export default Signup;