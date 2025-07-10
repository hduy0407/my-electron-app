import axios from "axios";
import {LocalGroups} from "../local.service";


const baseUrl = process.env.REACT_PUBLIC_URL_DB || 'http://localhost:8080';

export const fetchAndSaveGroups = async () => {
    try {
        const response = await axios.get(baseUrl + '/api/groups', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = response.data;
        console.log("API response for groups:", result);

        const groupsData = result.data.groups
        .filter(group => group.id && group.name)  // Filter out bad data
        .map(group => ({
            id: group.id,
            name: group.name,
            avatar: group.thumbnail?.trim() ? group.thumbnail : undefined
        }));

        const saveResult = await LocalGroups.saveGroup(groupsData);
    

        let verifyResult = null;
        if (saveResult.success) {
            verifyResult = await LocalGroups.getGroups();
           
        }

        return {
            success: true,
            groups: groupsData,
            localSave: saveResult,
            localVerify: verifyResult
        };

    } catch (err) {
        console.error('Error fetching groups:', err);
        return {
            success: false,
            error: err.response?.data?.message || 'Network or server error while fetching groups'
        };
    }
};

export const createGroup = async (groupData) => {
    try {
        const response = await axios.post(baseUrl + '/api/groups', groupData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = response.data;
        console.log("API response for creating group:", result);

        const getGroupsResult = await fetchAndSaveGroups();
        if (!getGroupsResult.success) {
            console.error("Failed to fetch and save groups after creating a new group:", getGroupsResult.error);
            return { success: false, error: getGroupsResult.error };
        }

        return {
            success: true,
            groups: getGroupsResult.groups,
            message: result.message || 'Group created successfully'
        };

    } catch (err) {
        console.error('Error creating group:', err);
        return {
            success: false,
            error: err.response?.data?.message || 'Network or server error while creating group'
        };
    }
}

export const updateGroup = async (groupId, groupData) => {
    try {
        const response = await axios.put(`${baseUrl}/api/groups/${groupId}`, groupData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = response.data;
        console.log("API response for updating group:", result);

        const getGroupsResult = await fetchAndSaveGroups();
        if (!getGroupsResult.success) {
            console.error("Failed to fetch and save groups after updating group:", getGroupsResult.error);
            return { success: false, error: getGroupsResult.error };
        }

        return {
            success: true,
            groups: getGroupsResult.groups,
            message: result.message || 'Group updated successfully'
        };

    } catch (err) {
        const status = err.response?.status;
        const errorMessage = err.response?.data?.message || 'Network or server error while updating group';

        if (status === 403) {
            return { success: false, error: 'You do not have permission to update this group.' };
        }

        console.error('Error updating group:', err);
        return {
            success: false,
            error: errorMessage
        };
    }
}
