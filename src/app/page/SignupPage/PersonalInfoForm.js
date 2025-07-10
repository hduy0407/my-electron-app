import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { requestRegister } from '../../service/remote-service/register.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PersonalInfoForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('pendingSignup');
    if (!stored) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const stored = localStorage.getItem('pendingSignup');
    if (!stored) {
      setError('Không tìm thấy thông tin đăng ký trước đó.');
      return;
    }

    const { email, username, password } = JSON.parse(stored);

    const genderMap = {
      male: '0',
      female: '1',
      other: ''
    };

    const fullData = {
        email,
        username,
        password,
        fullName: formData.fullName.trim(),
        gender: genderMap[formData.gender],
        dateOfBirth: Math.floor(new Date(formData.dateOfBirth).getTime() / 1000)
    };

    try {
      const res = await requestRegister(
        fullData.email,
        fullData.username,
        fullData.password,
        fullData.fullName,
        fullData.dateOfBirth,
        fullData.gender,
      );

      if (res.success) {
        localStorage.removeItem('pendingSignup');
        navigate("/home");
      } else {
        setError(res.error || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <IconButton
        onClick={() => navigate('/signup')}
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h5" gutterBottom>
        Hoàn thiện thông tin cá nhân
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Họ và tên"
          name="fullName"
          fullWidth
          margin="normal"
          required
          value={formData.fullName}
          onChange={handleChange}
        />

        <TextField
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <TextField
          label="Giới tính"
          name="gender"
          select
          fullWidth
          margin="normal"
          required
          value={formData.gender}
          onChange={handleChange}
        >
          <MenuItem value="male">Nam</MenuItem>
          <MenuItem value="female">Nữ</MenuItem>
          <MenuItem value="other">Khác</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Hoàn tất đăng ký'}
        </Button>
      </form>
    </Box>
  );
};

export default PersonalInfoForm;
