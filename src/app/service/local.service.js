// Wait for localDatabase to be available
const getLocalDatabase = () => {
    if (window.localDatabase) {
        return {
            user: window.localDatabase.user,
        };
    }
    return {
        user: null,
    };
};

export const { user: LocalUser } = getLocalDatabase();

// Helper function to check if LocalUser is available
export const isLocalUserAvailable = () => {
    return LocalUser !== null && typeof LocalUser.setCurrentUser === 'function';
};

