// Wait for localDatabase to be available
const getLocalDatabase = () => {
    if (window.localDatabase && window.localDatabase.user) {
        return window.localDatabase.user;
    }
    return null;
};

export const LocalUser = {
    getCurrentUser: () => {
        return getLocalDatabase();
    }
};

// Helper function to check if LocalUser is available
export const isLocalUserAvailable = () => {
    return LocalUser !== null && typeof LocalUser.setCurrentUser === 'function';
};

