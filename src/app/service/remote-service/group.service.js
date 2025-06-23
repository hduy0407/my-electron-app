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

        const groupsData = result.data.groups.map(group => ({
            id: group.id,
            name: group.name,
            avatar: group.thumbnail || undefined
        }));
        console.log("Groups fetched from API:", groupsData);

        const saveResult = await LocalGroups.saveGroup(groupsData);
        console.log("Local save result:", saveResult);
    

        let verifyResult = null;
        if (saveResult.success) {
            verifyResult = await LocalGroups.getGroups();
            console.log("Verified groups from local DB:", verifyResult);
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

        const groupToSave = {
            id: result.data.id,
            name: result.data.name,
            avatar: result.data.thumbnail || undefined
        };

        const saveResult = await LocalGroups.saveGroup(groupToSave);
        console.log("Local save result:", saveResult);

        return {
            success: true,
            group: result.data,
            localSave: saveResult
        };

    } catch (err) {
        console.error('Error creating group:', err);
        return {
            success: false,
            error: err.response?.data?.message || 'Network or server error while creating group'
        };
    }
}