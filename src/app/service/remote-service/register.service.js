
import { LocalUser } from "../../service/local.service";

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://192.168.2.233:8080';

export const requestRegister = async (email, username, password, navigate) => {
    
    try {
        const apiUrl = `${baseUrl}/api/auth/register`;
        console.log('Attempting login with URL:', apiUrl);

        if (!baseUrl) {
            console.error('Base URL is not configured. Please check your .env file');
            return {
                success: false,
                error: 'API URL is not configured. Please contact support.'
            };
        }

        const data = {
            email: email,
            username: username,
            password: password
        };

        console.log('Sending request to:', apiUrl);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"  
            },
            body: JSON.stringify(data),
        });

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error('Received non-JSON response:', contentType);
            console.error('Response status:', response.status);
            return {
                success: false,
                error: 'Server error: Invalid response format. Is the API server running?'
            };
        }

        const resData = await response.json();
        console.log('Response data:', resData);

        if (response.ok) {
            localStorage.setItem("token", resData.token); 

            const userData = {
                username: username,
                email: email,
                password: password
            };

            if (LocalUser?.setCurrentUser) {
                LocalUser.setCurrentUser(userData);
            }

            return { success: true, user: userData }; return true;
        } else {
            return { 
                success: false, 
                error: resData.message || 'Login failed. Please check your credentials.' 
            };
        }
    } catch (error) {
        console.error("Login error:", error);
        
        // Provide more specific error messages
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
    
}