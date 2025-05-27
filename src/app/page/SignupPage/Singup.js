import React from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer, } from '../../style/BoxStyle';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    return (
        <MainBox>
            <LeftBox>
                <FormContainer>
                    <Typography variant="h4" gutterBottom align='center'>
                        Tao tài khoản mới
                    </Typography>
                    <TextField
                        label="Nhập email của bạn"
                        variant="outlined"
                        type="email"
                        fullWidth
                        margin="normal"
                        borderRadius="15px"
                    />
                    <TextField
                        label="Nhập mật khẩu của bạn"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        borderRadius="15px"
                    />
                    <TextField
                        label="Xác nhận mật khẩu của bạn"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        borderRadius="15px"
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#3CA2F0', '&:hover': { backgroundColor: '#2288D7' }, boxShadow: 'none',  alignSelf: 'center', borderRadius: '15px'}}
                        onClick={() => navigate('/')}
                    >
                        Submit
                    </Button>
                </FormContainer>
            </LeftBox>
            <RightBox />
        </MainBox>
    );
}

export default Signup;