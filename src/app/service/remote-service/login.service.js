import { LocalUser, isLocalUserAvailable } from "../../service/local.service";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';

export const requestLogin = async (email, password) => {
    try {
        const apiUrl = `${baseUrl}/api/auth/login`;
        console.log('Attempting login with URL:', apiUrl);

        const data = {
            email: email,
            password: password
        };

        const response = await axios.post(apiUrl, data,{
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"  
            }
        });

        console.log('Response data:', response.data);

        const accessToken = response.data.data.accessToken;

        if (accessToken) {
            localStorage.setItem("token", accessToken); 
            console.log('Login successful, token stored:', accessToken);

            const user = response?.data?.data?.user;

            if (!user || !user.username) {
                console.error('Invalid response structure: user or username is missing', response.data);
                return { success: false, error: 'Invalid server response: user info missing' };
            }

            const userData = {
                id: response.data.data.user.id,
                username: response.data.data.user.username,
                email: email,
                full_name: response.data.data.user.fullName,
                date_of_birth: response.data.data.user.dateOfBirth,
                gender: response.data.data.gender
            };

            console.log('User data to save:', userData);

            let saveResult = { success: false, error: "LocalUser not available" };
            let verifyResult = null;

            if (isLocalUserAvailable()) {
                console.log("userData before saveUser:", userData);
                saveResult = await LocalUser.saveUser(userData);
                console.log("LocalUser.saveUser result:", saveResult);
                if (saveResult.success) {
                    verifyResult = await LocalUser.getCurrentUser();
                    console.log("Verified local user after save:", verifyResult);
                } else {
                    console.warn("Skipping verification due to failed save.");
                }

            } else {
                console.warn("LocalUser is not available, skipping local save.");
            }

            return { 
                success: true, 
                user: userData,
                localSave: saveResult,
                localerify: verifyResult
            };
           
        } else {
            return { 
                success: false, 
                error: 'No access token received' 
            };
        }
    } catch (error) {
        console.error("Login error:", error);

        if (error.response && error.response.data && error.response.data.message) {
            return { success: false, error: error.response.data.message };
        }

        return { 
            success: false, 
            error: 'Network or server error. Please check your connection and try again.' 
        };
    }
};
