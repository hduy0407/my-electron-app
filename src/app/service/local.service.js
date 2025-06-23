// Helper to safely get localDatabase.user
const getLocalDatabaseUser = () => {
    return window.localDatabase?.user || null;
};

const getLocalDatabaseGroups = () => {
    return window.localDatabase?.groups || null;
};

// LocalUser middleware API
export const LocalUser = {
    getCurrentUser: () => {
        const dbUser = getLocalDatabaseUser();
        return dbUser ? dbUser.getCurrentUser() : null;
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

    clearCurrentUser: () => {
        const dbUser = getLocalDatabaseUser();
        if (dbUser && typeof dbUser.logOut === 'function') {
            dbUser.logOut();
            localStorage.removeItem("currentUserEmail");
            console.log('Current user cleared');
            return { success: true };
        }
        return { success: false, error: 'logOut not available' };
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
    }
};

// Availability checker
export const isLocalUserAvailable = () => {
    const dbUser = getLocalDatabaseUser();
    return dbUser !== null &&
        typeof dbUser.getCurrentUser === 'function' &&
        typeof dbUser.saveUser === 'function';
};
