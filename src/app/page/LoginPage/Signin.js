import React, { useState } from 'react';
import { Avatar, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { requestLogin } from '../../service/remote-service/login.service';

import {
  PageWrapper,
  LeftPanel,
  RightPanel,
  WelcomeBox,
  FormCard,
  FormTitle,
  StyledTextField,
  SubmitButton,
  LinkLine
} from '../../style/BoxStyle';

function Signin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setError('');
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!data.email || !data.password) {
        setError('Vui lòng điền đầy đủ thông tin đăng nhập.');
        return;
      }

      const result = await requestLogin(data.email, data.password);
      if (result?.success) {
        navigate("/home");
      } else {
        setError(result?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LeftPanel>
        <WelcomeBox>
          <FormTitle variant="h5">Chào mừng bạn</FormTitle>
          <FormTitle variant="h6">tham gia</FormTitle>
          <Avatar sx={{ margin: '0 auto' }} />
          <FormTitle variant="h5">Máy chủ Hà Nội</FormTitle>
        </WelcomeBox>

        <FormCard component="form" onSubmit={handleSubmit}>
          <FormTitle variant="h4">Đăng nhập</FormTitle>

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <StyledTextField
            name="email"
            label="Nhập email của bạn"
            variant="outlined"
            type="email"
            value={data.email}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />
          <StyledTextField
            name="password"
            label="Nhập mật khẩu của bạn"
            variant="outlined"
            type="password"
            value={data.password}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </SubmitButton>

          <LinkLine>
            Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
          </LinkLine>
        </FormCard>
      </LeftPanel>

      <RightPanel />
    </PageWrapper>
  );
}

export default Signin;
