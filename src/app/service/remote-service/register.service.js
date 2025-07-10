import { LocalUser } from "../../service/local.service";

const baseUrl = process.env.REACT_APP_URL_DB || 'http://localhost:8080';

export const requestRegister = async (
  email,
  username,
  password,
  fullName = '',
  dateOfBirth = '',
  gender = '',
) => {
  try {
    const apiUrl = `${baseUrl}/api/auth/register`;
    console.log('Attempting register with URL:', apiUrl);

    if (!baseUrl) {
      console.error('Base URL is not configured. Please check your .env file');
      return {
        success: false,
        error: 'API URL is not configured. Please contact support.'
      };
    }

    // Combine required and optional fields
    const data = {
      email,
      username,
      password,
      fullName,
      dateOfBirth,
      gender,
    };

    console.log('Sending request with body:', data);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('Received non-JSON response:', contentType);
      return {
        success: false,
        error: 'Server error: Invalid response format. Is the API server running?'
      };
    }

    const resData = await response.json();
    console.log('Response data:', resData);

    if (response.ok) {
      localStorage.setItem("token", resData.token);

      const userData = { username, email, password, fullName, gender, dateOfBirth };

      if (LocalUser?.setCurrentUser) {
        LocalUser.setCurrentUser(userData);
      }

      return { success: true, user: userData };
    } else {
      return {
        success: false,
        error: resData.message || 'Registration failed. Please check your input.'
      };
    }

  } catch (error) {
    console.error("Registration error:", error);

    if (error.message.includes('<!DOCTYPE')) {
      return {
        success: false,
        error: 'Cannot connect to API server. Please ensure the backend server is running.'
      };
    }

    return {
      success: false,
      error: 'Network or server error. Please check your connection and try again.'
    };
  }
};
