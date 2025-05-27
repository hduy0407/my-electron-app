import React from 'react'
import { Typography, TextField, Button, Avatar } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer, } from '../../style/BoxStyle';
import { useNavigate } from 'react-router-dom';


function Signin() {

    const navigate = useNavigate();

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
                <FormContainer>
                    <Typography variant="h4" gutterBottom align='center'>
                        Đăng nhập
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

export default Signin;