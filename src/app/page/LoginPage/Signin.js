import React, { useState } from 'react'
import { Typography, TextField, Button, Avatar, Alert } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer } from '../../style/BoxStyle';
import { useNavigate } from 'react-router-dom';
import { requestLogin } from '../../service/remote-service/login.service';

function Signin() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setError(''); // Clear error when user types
        setData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!data.email || !data.password) {
                setError('Please fill in all fields');
                return;
            }

            console.log('Attempting login with:', data.email); // Debug log
            const result = await requestLogin(data.email, data.password);
            console.log('Login result:', result); // Debug log

            if (result?.success) {
                console.log('Login successful, navigating...'); // Debug log
                navigate("/home");
            } else {
                setError(result?.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainBox>
            <LeftBox>
                <FormContainer sx={{ mb: 8 }}>
                    <Typography variant="h5" gutterBottom align='center'>
                        Chào mừng bạn
                    </Typography>
                    <Typography variant="h6" gutterBottom align='center'>
                        tham gia
                    </Typography>
                    <Avatar alt="" />
                    <Typography variant="h5" gutterBottom align='center'>
                        Máy chủ Hà Nội
                    </Typography>
                </FormContainer>
                <FormContainer component="form" onSubmit={handleSubmit}>
                    <Typography variant="h4" gutterBottom align='center'>
                        Đăng nhập
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        name='email'
                        label="Nhập email của bạn"
                        variant="outlined"
                        type="email"
                        value={data.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!error}
                        disabled={loading}
                    />
                    <TextField
                        name='password'
                        label="Nhập mật khẩu của bạn"
                        variant="outlined"
                        type="password"
                        value={data.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!error}
                        disabled={loading}
                    />
                    <Button
                        variant="contained"
                        type='submit'
                        disabled={loading}
                        sx={{ 
                            mt: 2, 
                            backgroundColor: '#3CA2F0', 
                            '&:hover': { backgroundColor: '#2288D7' }, 
                            boxShadow: 'none',  
                            alignSelf: 'center', 
                            borderRadius: '15px',
                            width: '100%'
                        }}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </FormContainer>
            </LeftBox>
            <RightBox />
        </MainBox>
    )
}

export default Signin;