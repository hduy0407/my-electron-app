import React from 'react'
import { Container, Box, Typography, TextField, Button } from '@mui/material';

function Home() {
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
                    JOIN US
                </Typography>
                <TextField
                    label="Enter your email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#3CC0F0', '&:hover': { backgroundColor: '#28a6d3' } }}
                >
                    Submit
                </Button>
            </Container>
        </Box>

        <Box
            sx={{
            flex: 1,
            backgroundImage: 'url()',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        />
    </Box>
  )
}

export default Home