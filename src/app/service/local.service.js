
const getLocalDatabaseUser = () => {
    return window.localDatabase?.users || null;
};

const getLocalDatabaseGroups = () => {
    return window.localDatabase?.groups || null;
};

const getLocalDatabasePosts = () => {
    return window.localDatabase?.posts || null;
};

const getLocalDatabaseGroupUsers = () => {
    return window.localDatabase?.groupUsers || null;
};

// LocalUser middleware API
export const LocalUser = {
    getCurrentUser: async () => {
        const dbUser = getLocalDatabaseUser();
        console.log("dbUser.getCurrentUser available?", typeof dbUser?.getCurrentUser);

        if (!dbUser || typeof dbUser.getCurrentUser !== 'function') {
            console.warn("getCurrentUser not available");
            return { success: false, error: 'localDatabase.users or getCurrentUser not available' };
        }

        const result = await dbUser.getCurrentUser();
        console.log("Result from preload:", result);

        if (result && result.success) {
            return result;
        } else {
            return { success: false, error: 'User not found in DB' };
        }
    },
    saveUser: async (userData) => {
        const dbUser = getLocalDatabaseUser();
        if (dbUser && typeof dbUser.saveUser === 'function') {
            const saveResult = await dbUser.saveUser(userData);

            if (saveResult.success) {
                localStorage.setItem("currentUserEmail", userData.email);
                console.log('User saved successfully:', userData);
            } else {
                console.warn('User save failed:', saveResult.error);
            }

            return { ...saveResult, user: userData };
        }

        return { success: false, error: 'localDatabase.user not available' };
    },

    setCurrentUser: (userData) => {
        const dbUser = getLocalDatabaseUser();
        if (dbUser && typeof dbUser.setCurrentUser === 'function') {
            return dbUser.setCurrentUser(userData);
        }
        return { success: false, error: 'setCurrentUser not available' };
    },

    clearCurrentUser: async () => {
        const dbUser = getLocalDatabaseUser();
        if (dbUser && typeof dbUser.logOut === 'function') {
            dbUser.logOut();
            await LocalUser.clearUser();  // This clears from DB if implemented
            await LocalGroups.clearAllGroups();
            await LocalGroupUsers.clearAllGroupUsers();
            await LocalPosts.clearAllPosts();
            localStorage.removeItem("currentUserEmail");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("token");
            console.log('Current user cleared');
            return { success: true };
        }
        return { success: false, error: 'logOut not available' };
    },

    clearUser: async () => {
        const dbUser = getLocalDatabaseUser();
        if (dbUser && typeof dbUser.clearUser === 'function') {
            return await dbUser.clearUser();
        }
        return { success: false, error: 'clearUser not available' };
    }

};

export const LocalGroups = {
    saveGroup: async (groupData) => {
        const dbGroups = getLocalDatabaseGroups();
        if (dbGroups && typeof dbGroups.saveGroup === 'function') {
            const saveResult = await dbGroups.saveGroup(groupData);
            if (saveResult.success) {
                console.log('Group saved successfully:', groupData);
            } else {
                console.warn('Group save failed:', saveResult.error);
            }
            return { ...saveResult, group: groupData };
        }
        return { success: false, error: 'localDatabase.groups not available' };
    },

    getGroups: async () => {
        const dbGroups = getLocalDatabaseGroups();
        if (dbGroups && typeof dbGroups.getGroups === 'function') {
            return await dbGroups.getGroups();
        }
        return { success: false, error: 'localDatabase.groups not available' };
    },
    clearAllGroups: async () => {
        const dbGroups = getLocalDatabaseGroups();
        if (dbGroups && typeof dbGroups.clearAllGroups === 'function') {
            return await dbGroups.clearAllGroups();
        }
        return { success: false, error: 'clearAllGroups not available' };
    }

};

export const LocalPosts = {
    savePost: async (postData) => {
        const dbPosts = getLocalDatabasePosts();
        if (dbPosts && typeof dbPosts.savePost === 'function') {
            try {
            // Ensure created_at is included
            if (!postData.created_at) {
                console.warn(`savePost called without created_at for post ${postData.id}`);
            }

            const result = await dbPosts.savePost(postData);
            return result;
            } catch (err) {
                return { success: false, error: err.message };
            }
        }
        return { success: false, error: 'savePost not available' };
    },

    getPosts: async () => {
        const dbPosts = getLocalDatabasePosts();
        if (dbPosts?.getPosts) return await dbPosts.getPosts();
        return { success: false, error: 'getPosts not available' };
    },

    getPostsByGroupId: async (groupId) => {
        const dbPosts = getLocalDatabasePosts();
        if (dbPosts?.getPostsByGroupId) return await dbPosts.getPostsByGroupId(groupId);
        return { success: false, error: 'getPostsByGroupId not available' };
    },

    getPostById: async (postId) => {
        const dbPosts = getLocalDatabasePosts();
        if (dbPosts?.getPostById) return await dbPosts.getPostById(postId);
        return { success: false, error: 'getPostById not available' };
    },
    getLatestMessageByGroupId: async (groupId) => {
        const dbPosts = getLocalDatabasePosts();
        if (dbPosts?.getLatestMessageByGroupId) {
        return await dbPosts.getLatestMessageByGroupId(groupId);
        }
        return { success: false, error: 'getLatestMessageByGroupId not available' };
    },
    clearAllPosts: async () => {
        const dbPosts = getLocalDatabasePosts();
        if (dbPosts && typeof dbPosts.clearAllPosts === 'function') {
            return await dbPosts.clearAllPosts();
        }
        return { success: false, error: 'clearAllPosts not available' };
    }
};

export const LocalGroupUsers = {
    saveGroupUsers: async (groupUsersData) => {
        const dbGroupUsers = getLocalDatabaseGroupUsers();
        if (dbGroupUsers && typeof dbGroupUsers.saveGroupUsers === 'function') {
            return await dbGroupUsers.saveGroupUsers(groupUsersData);
        }
        return { success: false, error: 'localDatabase.groupUsers not available' };
    },
    getGroupUsersByGroupId: async (groupId) => {
        const dbGroupUsers = getLocalDatabaseGroupUsers();
        if (dbGroupUsers && typeof dbGroupUsers.getGroupUsersByGroupId === 'function') {
            return await dbGroupUsers.getGroupUsersByGroupId(groupId);
        }
        return { success: false, error: 'getGroupUsersByGroupId not available' };
    },
    clearAllGroupUsers: async (groupId) => {
        const dbGroupUsers = getLocalDatabaseGroupUsers();
        if (dbGroupUsers && typeof dbGroupUsers.clearAllGroupUsers === 'function') {
            return await dbGroupUsers.clearAllGroupUsers();
        }
        return { success: false, error: 'getGroupUsersByGroupId not available' };
    },
}

// Availability checker
export const isLocalUserAvailable = () => {
    const dbUser = getLocalDatabaseUser();
    return dbUser !== null &&
        typeof dbUser.getCurrentUser === 'function' &&
        typeof dbUser.saveUser === 'function';
};
