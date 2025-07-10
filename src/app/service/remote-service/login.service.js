import { LocalUser, isLocalUserAvailable } from "../../service/local.service";
import axios from "axios";
import { fetchAndSaveGroups } from "../../service/remote-service/group.service";
import { fetchAndSaveGroupUsers } from "../../service/remote-service/groupUser.service";
import { requestPost } from "../../service/remote-service/post.service";

const baseUrl = process.env.REACT_APP_URL_DB || 'http://localhost:8080';

export const requestLogin = async (email, password) => {
  try {
    const apiUrl = `${baseUrl}/api/auth/login`;
    console.log('Attempting login with URL:', apiUrl);

    const response = await axios.post(apiUrl, { email, password }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const accessToken = response.data?.data?.accessToken;
    const refreshToken = response.data?.data?.refreshToken;
    const user = response.data?.data?.user;

    if (!accessToken || !user || !user.username) {
      return { success: false, error: 'Invalid login response' };
    }

    // Store tokens
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    console.log('Tokens stored');

    const userData = {
      id: user.id,
      username: user.username,
      email,
      full_name: user.fullName,
      date_of_birth: user.dateOfBirth,
      gender: user.gender
    };

    // Save user locally
    let saveResult = { success: false, error: "LocalUser not available" };
    let verifyResult = null;

    if (isLocalUserAvailable()) {
      saveResult = await LocalUser.saveUser(userData);
      if (saveResult.success) {
        verifyResult = await LocalUser.getCurrentUser();
      }
    }

    // Step 1: Fetch ALL groups (even if we don’t know user membership yet)
    const groupResult = await fetchAndSaveGroups();
    const allGroups = groupResult.groups || [];

    const userGroups = [];

    // Step 2: For each group, fetch users and check if current user is a member
    for (const group of allGroups) {
      const groupUsersResult = await fetchAndSaveGroupUsers(group.id);
      console.log(`Synced group users for group ${group.id}:`, groupUsersResult);

      if (
        groupUsersResult.success &&
        groupUsersResult.groupUsers.some(u => u.userId === userData.id)
      ) {
        userGroups.push(group);
      }
    }

    console.log(`[LOGIN] User is in ${userGroups.length} groups:`, userGroups.map(g => g.id));

    // Step 3: Fetch posts
    const postsResult = await requestPost();

    return {
      success: true,
      user: userData,
      localSave: saveResult,
      localVerify: verifyResult,
      groupSave: groupResult,
      postsSave: postsResult,
      groupsSynced: userGroups.length
    };

  } catch (error) {
    console.error("Login error:", error);

    const errorMessage = error.response?.data?.message ||
      'Network or server error. Please check your connection and try again.';

    return {
      success: false,
      error: errorMessage
    };
  }
};
