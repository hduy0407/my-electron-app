import React, { useState } from 'react';
import {
  CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { requestRegister } from '../../service/remote-service/register.service';

import {
  PageWrapper,
  LeftPanel,
  RightPanel,
  FormCard,
  FormTitle,
  StyledTextField,
  SubmitButton,
  LinkLine
} from '../../style/BoxStyle';

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

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,20}$/;

  const validateForm = () => {
    let tempErrors = {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!data.email) {
      tempErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!data.username) {
      tempErrors.username = 'Tên người dùng là bắt buộc';
      isValid = false;
    } else if (data.username.length < 3 || data.username.length > 20) {
      tempErrors.username = 'Tên người dùng phải từ 3 đến 20 ký tự';
      isValid = false;
    }

    if (!data.password) {
      tempErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (!passwordRegex.test(data.password)) {
      tempErrors.password = 'Mật khẩu phải dài 6-20 ký tự, có ít nhất một chữ hoa, một chữ thường và một ký tự đặc biệt';
      isValid = false;
    }

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
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const basicInfo = {
      email: data.email,
      username: data.username,
      password: data.password,
    };
    localStorage.setItem('pendingSignup', JSON.stringify(basicInfo));
    navigate("/personal-info");
  };

  return (
    <PageWrapper>
      <LeftPanel>
        <FormCard component="form" onSubmit={handleSubmit}>
          <FormTitle variant="h4">Tạo tài khoản mới</FormTitle>

          <StyledTextField
            name="email"
            label="Nhập email của bạn"
            value={data.email}
            onChange={handleChange}
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />

          <StyledTextField
            name="username"
            label="Nhập tên người dùng"
            value={data.username}
            onChange={handleChange}
            fullWidth
            error={!!errors.username}
            helperText={errors.username}
          />

          <StyledTextField
            name="password"
            label="Nhập mật khẩu"
            value={data.password}
            onChange={handleChange}
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />

          <StyledTextField
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            value={data.confirmPassword}
            onChange={handleChange}
            type="password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
          </SubmitButton>

          <LinkLine>
            Bạn đã có tài khoản? <Link to="/">Đăng nhập</Link>
          </LinkLine>
        </FormCard>
      </LeftPanel>
      <RightPanel />
    </PageWrapper>
  );
};

export default Signup;
