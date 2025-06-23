const createGroupsTable = (db) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY,
        name TEXT NOT NULL,
        thumbnail TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`).run();
}

const saveGroup = (db, groupData) => {
    if (!groupData || typeof groupData !== 'object') {
        console.error('saveGroup received invalid groupData:', groupData);
        return { success: false, error: 'Invalid group data' };
    }

    const { id, name, thumbnail } = groupData;

    if (!id || !name) {
        console.error('Missing required fields in groupData:', groupData);
        return { success: false, error: 'Missing group id or name' };
    }

    try {
        // Check if group already exists
        const existingGroup = db.prepare('SELECT * FROM groups WHERE id = ?').get(id);

        if (existingGroup) {
            // Update group
            const stmt = db.prepare(`UPDATE groups SET name = ?, thumbnail = ? WHERE id = ?`);
            stmt.run(name, thumbnail, id);
            return { success: true, updated: true };
        } else {
            // Insert new group
            const stmt = db.prepare(`INSERT INTO groups (id, name, thumbnail) VALUES (?, ?, ?)`);
            stmt.run(id, name, thumbnail);
            return { success: true, inserted: true };
        }
    } catch (error) {
        console.error('Error saving group:', error);
        return { success: false, error: error.message };
    }
};

const getGroups = (db) => {
    if (!db) {
        console.error('Database connection is not available');
        return { success: false, error: 'Database connection is not available' };
    }
    try {
        const groups = db.prepare(`SELECT * FROM groups`).all();
        return { success: true, groups };
    } catch (error) {
        console.error('Error retrieving groups:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { createGroupsTable, saveGroup, getGroups };