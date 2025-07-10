const createGroupUsersTable = (db) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS group_users (
        username TEXT,
        email TEXT UNIQUE,
        full_name TEXT,
        gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')) DEFAULT 'OTHER',
        group_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'member')) DEFAULT 'member',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (group_id, user_id)
    )`).run();
};


const migrateGroupUsersTable = (db) => {
    const columns = db.prepare(`PRAGMA table_info(group_users)`).all();
    const columnNames = columns.map(col => col.name);

    // Add username
    if (!columnNames.includes('username')) {
        db.prepare(`ALTER TABLE group_users ADD COLUMN username TEXT `).run();
        console.log('Added "username" column to group_users');
    }

    // Add email
    if (!columnNames.includes('email')) {
        db.prepare(`ALTER TABLE group_users ADD COLUMN email TEXT UNIQUE `).run();
        console.log('Added "email" column to group_users');
    }

    // Add full_name
    if (!columnNames.includes('full_name')) {
        db.prepare(`ALTER TABLE group_users ADD COLUMN full_name TEXT`).run();
        console.log('Added "full_name" column to group_users');
    }

    // Add gender
    if (!columnNames.includes('gender')) {
        db.prepare(`ALTER TABLE group_users ADD COLUMN gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')) DEFAULT 'OTHER'`).run();
        console.log('Added "gender" column to group_users');
    }
};



const saveGroupUsers = (db, groupUsersData) => {
  if (!groupUsersData || typeof groupUsersData !== 'object') {
    console.error('saveGroupUsers received invalid groupUsersData:', groupUsersData);
    return { success: false, error: 'Invalid group users data' };
  }

  const groupUsers = Array.isArray(groupUsersData) ? groupUsersData : [groupUsersData];
  const results = [];

  for (const gu of groupUsers) {
    const { group_id, user_id, role, username, full_name, email, gender } = gu;

    if (!group_id || !user_id) {
      console.error('Missing required fields in groupUsersData:', gu);
      results.push({ success: false, error: 'Missing group_id or user_id', groupUser: gu });
      continue;
    }

    try {
      const existingGroupUser = db.prepare('SELECT * FROM group_users WHERE group_id = ? AND user_id = ?').get(group_id, user_id);

      if (existingGroupUser) {
        // Update all relevant fields
        const stmt = db.prepare(`
          UPDATE group_users 
          SET role = ?, username = ?, full_name = ?, email = ?, gender = ?
          WHERE group_id = ? AND user_id = ?
        `);
        stmt.run(role, username, full_name, email, gender, group_id, user_id);
        results.push({ success: true, updated: true, groupUser: gu });
      } else {
        // Insert new entry
        const stmt = db.prepare(`
          INSERT INTO group_users (group_id, user_id, role, username, full_name, email, gender)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(group_id, user_id, role, username, full_name, email, gender);
        results.push({ success: true, inserted: true, groupUser: gu });
      }
    } catch (error) {
      console.error('Error saving group user:', error);
      results.push({ success: false, error: error.message, groupUser: gu });
    }
  }

  return { success: results.every(r => r.success), results };
};



const getGroupUsersByGroupId = (db, groupId) => {
    if (!db) {
        console.error('Database connection is not available');
        return { success: false, error: 'Database connection is not available' };
    }
    try {
        const groupUsers = db.prepare(`SELECT * FROM group_users WHERE group_id = ?`).all(groupId);
        return { success: true, groupUsers };
    } catch (error) {
        console.error('Error retrieving group users:', error);
        return { success: false, error: error.message };
    }
};

const clearAllGroupUsers = (db) => {
    try {
        db.prepare(`DELETE FROM group_users`).run();
        return { success: true };
    } catch (error) {
        console.error('Error clearing group_users table:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    createGroupUsersTable,
    saveGroupUsers,
    getGroupUsersByGroupId,
    migrateGroupUsersTable,
    clearAllGroupUsers
};