import React, { useState, useEffect } from 'react'
import { Typography, TextField, Button, Avatar } from '@mui/material';
import { MainBox, RightBox, LeftBox, FormContainer, } from '../../style/BoxStyle';
import { useNavigate } from 'react-router-dom';

function Signin() {

    const navigate = useNavigate();

    const baseUrl = process.env.REACT_APP_URL_DB;

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const {email, password} = data;

    const handleChange = (e) => {

        console.log(
            {event: e,
            data
            }
        );
        
        setData(preState => ({
            ...preState,
            [e.target.name]: e.target.value
        }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch(`${baseUrl}/api/users/login`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("token", data.token); 
                
                navigate("/home");

            } else {
                console.log("Login failed:", data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Something went wrong");
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
                <FormContainer onSubmit={handleSubmit}>
                    <Typography variant="h4" gutterBottom align='center'>
                        Đăng nhập
                    </Typography>
                    <TextField
                    name='email'
                        label="Nhập email của bạn"
                        variant="outlined"
                        type="email"
                        value={data.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        borderRadius="15px"
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
                        borderRadius="15px"
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#3CA2F0', '&:hover': { backgroundColor: '#2288D7' }, boxShadow: 'none',  alignSelf: 'center', borderRadius: '15px'}}>
                        Submit
                    </Button>
                </FormContainer>
            </LeftBox>

            <RightBox />
        </MainBox>
    )
}

export default Signin;