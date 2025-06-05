import React, {use, useState} from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer, } from '../../style/BoxStyle';
import { useNavigate } from 'react-router-dom';
import { requestRegister } from '../../service/remote-service/register.service';

const Signup = () => {
    const navigate = useNavigate();
    
    const [data, setData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        e.preventDefault();
        setData(preState => ({
            ...preState,
            [e.target.name]: e.target.value
        }));
    }

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const callAPI = await requestRegister(data.email, data.username, data.password)

            if (callAPI.success) {
                navigate("/home");
            } else {
                alert("Registration failed. Please try again.");
            }
            // add a custom hook for clarify the success of register and then navigate to home page
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration. Please try again later.");
        }
           
    };
    return (
        <MainBox>
            <LeftBox>
                <FormContainer onSubmit={handleSubmit}>
                    <Typography variant="h4" gutterBottom align='center'>
                        Tao tài khoản mới
                    </Typography>
                    <TextField
                        name="email"
                        value={data.email}
                        label="Nhập email của bạn"
                        variant="outlined"
                        type="email"
                        fullWidth
                        margin="normal"
                        borderRadius="15px"
                    />
                    <TextField
                        name="password"
                        value={data.password}
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