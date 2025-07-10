const createGroupsTable = (db) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
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

    const groups = Array.isArray(groupData) ? groupData : [groupData];
    const results = [];

    for (const g of groups) {
        const { id, name, thumbnail } = g;

        if (!id || !name) {
            console.error('Missing required fields in groupData:', g);
            results.push({ success: false, error: 'Missing group id or name', group: g });
            continue;
        }

        try {
            const existingGroup = db.prepare('SELECT * FROM groups WHERE id = ?').get(id);

            if (existingGroup) {
                const stmt = db.prepare(`UPDATE groups SET name = ?, thumbnail = ? WHERE id = ?`);
                stmt.run(name, thumbnail, id);
                results.push({ success: true, updated: true, group: g });
            } else {
                const stmt = db.prepare(`INSERT INTO groups (id, name, thumbnail) VALUES (?, ?, ?)`);
                stmt.run(id, name, thumbnail);
                results.push({ success: true, inserted: true, group: g });
            }
        } catch (error) {
            console.error('Error saving group:', error);
            results.push({ success: false, error: error.message, group: g });
        }
    }

    return { success: results.every(r => r.success), results };
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

const clearAllGroups = (db) => {
  try {
    db.prepare(`DELETE FROM groups`).run();
    return { success: true };
  } catch (error) {
    console.error('Error clearing groups table:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { createGroupsTable, saveGroup, getGroups, clearAllGroups};