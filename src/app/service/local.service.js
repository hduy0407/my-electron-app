// Helper to safely get localDatabase.user
const getLocalDatabaseUser = () => {
    return window.localDatabase?.user || null;
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
    }
};

// Availability checker
export const isLocalUserAvailable = () => {
    const dbUser = getLocalDatabaseUser();
    return dbUser !== null &&
        typeof dbUser.getCurrentUser === 'function' &&
        typeof dbUser.saveUser === 'function';
};
