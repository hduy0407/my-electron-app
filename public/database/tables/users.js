const createUsersTable = (db) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        gender TEXT CHECK (gender IN ('M', 'F', 'O')) DEFAULT 'O',
        date_of_birth TEXT
    )`).run();
};

const saveUser = (db, userData) => {
    if (!userData || typeof userData !== 'object') {
        console.error('saveUser received invalid userData:', userData);
        return { success: false, error: 'Invalid userData' };
    }

    const { id, username, email, full_name, gender, date_of_birth } = userData;

    if (!id || !username || !email) {
        console.error('Missing fields in userData:', userData);
        return { success: false, error: 'Missing id, username, or email' };
    }

    try {
        // Check if user exists
        const existingUser = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(id, email);

        if (existingUser) {
            // Update the user if new data is provided
            const stmt = db.prepare(`
                UPDATE users
                SET username = ?,
                    email = ?,
                    full_name = ?,
                    gender = ?,
                    date_of_birth = ?
                WHERE id = ?
            `);
            const result = stmt.run(
                username,
                email,
                full_name || existingUser.full_name,
                gender || existingUser.gender,
                date_of_birth || existingUser.date_of_birth,
                existingUser.id
            );

            console.log('User updated:', existingUser.id);
            return { success: true, updated: true, id: existingUser.id };
        } else {
            // Insert new user
            const stmt = db.prepare(`
                INSERT INTO users (id, username, email, full_name, gender, date_of_birth)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                id,
                username,
                email,
                full_name || null,
                gender || 'O',
                date_of_birth || null
            );

            console.log('User inserted:', id);
            return { success: true, inserted: true, id: id };
        }

    } catch (error) {
        console.error('Error saving user:', error);
        return { success: false, error: error.message };
    }
};


const getCurrentUser = (db, email) => {
    if (!email) {
        console.error('Missing email for getCurrentUser');
        return { success: false, error: 'Missing email' };
    }

    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);

        if (user) {
            return { success: true, user };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error retrieving current user:', error);
        return { success: false, error: error.message };
    }
};

const getUserByUsername = (db, username) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        return user || null;
    } catch (error) {
        console.error('Error retrieving user by username:', error);
        return null;
    }
}

module.exports = {createUsersTable, saveUser, getUserByUsername, getCurrentUser};