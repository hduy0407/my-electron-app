const saveUser = (db, userData) => {
    const { username, password, email } = userData;

    try {
        // Check if user already exists
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return { success: false, error: 'User already exists' };
        } 

        const stmt = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
        const result = stmt.run(username, password, email);
        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        console.error('Error saving user:', error);
        return { success: false, error: error.message };
    }
};

const getUser = (db, email) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);
        if (user) {
            return { success: true, user };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error retrieving user login:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    saveUser,
    getUser
}; 