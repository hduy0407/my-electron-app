import React, { useState } from 'react';
import { Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer } from '../../style/BoxStyle';
import { useNavigate, Link } from 'react-router-dom';
import { requestRegister } from '../../service/remote-service/register.service';


const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [data, setData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const validateForm = () => {
        let tempErrors = {
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        };
        let isValid = true;

        // Email validation
        if (!data.email) {
            tempErrors.email = 'Email là bắt buộc';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            tempErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        // Username validation
        if (!data.username) {
            tempErrors.username = 'Tên người dùng là bắt buộc';
            isValid = false;
        }

        // Password validation
        if (!data.password) {
            tempErrors.password = 'Mật khẩu là bắt buộc';
            isValid = false;
        } else if (data.password.length < 6) {
            tempErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        // Confirm password validation
        if (!data.confirmPassword) {
            tempErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            tempErrors.confirmPassword = 'Mật khẩu không khớp';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        setErrors(prevState => ({
            ...prevState,
            [name]: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const callAPI = await requestRegister(data.email, data.username, data.password);

            if (callAPI.success) {
                navigate("/");
            } else {
                setError("Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainBox>
            <LeftBox>
                <FormContainer onSubmit={handleSubmit}>
                    <Typography variant="h4" gutterBottom align='center'>
                        Tạo tài khoản mới
                    </Typography>
                    
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    <TextField
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        label="Nhập email của bạn"
                        variant="outlined"
                        type="email"
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    
                    <TextField
                        name="username"
                        onChange={handleChange}
                        value={data.username}
                        label="Nhập tên người dùng"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.username}
                        helperText={errors.username}
                    />

                    <TextField
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Nhập mật khẩu của bạn"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <TextField
                        name="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleChange}
                        label="Xác nhận mật khẩu của bạn"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        sx={{ 
                            mt: 2, 
                            backgroundColor: '#3CA2F0', 
                            '&:hover': { backgroundColor: '#2288D7' }, 
                            boxShadow: 'none',  
                            alignSelf: 'center', 
                            borderRadius: '15px',
                            width: '100%'
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
                    </Button>

                    <Typography>Bạn đã có tài khoản? <Link to="/">Đăng nhập</Link></Typography>
                </FormContainer>
            </LeftBox>
            <RightBox />
        </MainBox>
    );
};

export default Signup;