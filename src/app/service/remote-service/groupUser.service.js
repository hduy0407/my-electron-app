import axios from "axios";
import { LocalGroupUsers } from "../local.service";

const baseUrl = process.env.REACT_APP_URL_DB || 'http://localhost:8080';

export const fetchAndSaveGroupUsers = async (groupId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/groups/${groupId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    const groupData = response.data?.data;
    if (!groupData || !Array.isArray(groupData.users)) {
      return { success: false, error: 'Invalid group data' };
    }

    const users = groupData.users;

    const enrichedUsers = [];

    for (const user of users) {
      if (!user.userId) continue;

      // Fetch full user info from /api/users?keyword=username
      const keyword = user.username || user.fullName || '';
      let email = '';
      let gender = 'OTHER';

      try {
        const userRes = await axios.get(`${baseUrl}/api/users?keyword=${encodeURIComponent(keyword)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const matchedUser = userRes.data?.data?.users?.find(u => u.id === user.userId);

        if (matchedUser) {
          email = matchedUser.email || '';
          gender = matchedUser.gender || 'OTHER';
        }
      } catch (err) {
        console.warn(`Failed to fetch full user info for ${keyword}:`, err.message);
      }

      enrichedUsers.push({
        user_id: user.userId,
        group_id: groupData.id,
        role: user.role?.toLowerCase() || 'member',
        username: user.username || '',
        full_name: user.fullName || '',
        email,
        gender
      });
    }

    console.log("Group users with enriched info:", enrichedUsers);

    const saveResult = await LocalGroupUsers.saveGroupUsers(enrichedUsers);
    console.log("Local save result for group users:", saveResult);

    let verifyResult = null;
    if (saveResult.success) {
      verifyResult = await LocalGroupUsers.getGroupUsersByGroupId(groupId);
      console.log("Verified group users from local DB:", verifyResult);
    }

    return {
      success: true,
      groupUsers: enrichedUsers,
      localSave: saveResult,
      localVerify: verifyResult
    };

  } catch (err) {
    console.error('Error fetching group users:', err);
    return {
      success: false,
      error: err.response?.data?.message || 'Network or server error while fetching group users'
    };
  }
};



export const addUserToGroupByUserId = async (groupId, userId, role = 'MEMBER') => {
    try {
        // POST to add user to group (backend handles role)
        await axios.post(`${baseUrl}/api/groups/${groupId}/members`, { userId, role }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        // Fetch and update local DB with updated group user list
        const sync = await fetchAndSaveGroupUsers(groupId);

        return {
            success: true,
            message: 'User added successfully',
            sync
        };
    } catch (err) {
        console.error("Error adding user to group:", err);
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to add user to group'
        };
    }
};

export const searchUsersByKeyword = async (keyword) => {
    try {
        const response = await axios.get(`${baseUrl}/api/users?keyword=${encodeURIComponent(keyword)}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const result = response.data;
        console.log("Search users result:", result);
        const users = result.data?.users || [];

        return {
            success: true,
            users
        };
    } catch (err) {
        console.error("Error searching users:", err);
        return {
            success: false,
            message: err.response?.data?.message || "Search failed"
        };
    }
};

export const deleteUserFromGroup = async (groupId, userId) => {
  try {
    // Call backend API to delete the user from the group
    await axios.delete(`${baseUrl}/api/groups/${groupId}/members/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Call local service to delete from local DB
    const localDeleteResult = await LocalGroupUsers.deleteUserFromGroup(groupId, userId);

    // Optionally fetch updated local data
    const updatedUsers = await LocalGroupUsers.getGroupUsersByGroupId(groupId);

    return {
      success: true,
      message: 'User removed from group successfully',
      local: localDeleteResult,
      groupUsers: Array.isArray(updatedUsers) ? updatedUsers : updatedUsers?.groupUsers || []
    };
  } catch (err) {
    console.error("Error removing user from group:", err);
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to remove user from group'
    };
  }
};
