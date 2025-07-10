const createPostsTable = (db) => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();
};

const migratePostsIdToText = (db) => {
  // Step 1: Rename old table
  db.prepare(`ALTER TABLE posts RENAME TO posts_old`).run();

  // Step 2: Create new table with correct schema
  db.prepare(`
    CREATE TABLE posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      group_id TEXT
    )
  `).run();

  // Step 3: Copy data (convert id to TEXT)
  const rows = db.prepare(`SELECT * FROM posts_old`).all();
  const insert = db.prepare(`
    INSERT INTO posts (id, user_id, content, created_at, group_id)
    VALUES (@id, @user_id, @content, @created_at, @group_id)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      row.id = String(row.id); // convert INTEGER id to TEXT
      insert.run(row);
    }
  });

  insertMany(rows);

  // Step 4: Drop old table
  db.prepare(`DROP TABLE posts_old`).run();

  console.log("Migrated posts.id to TEXT");
};


const addGroupIdColumnIfMissing = (db) => {
  const columns = db.prepare("PRAGMA table_info(posts)").all();
  const hasGroupId = columns.some(col => col.name === "group_id");

  if (!hasGroupId) {
    db.prepare(`ALTER TABLE posts ADD COLUMN group_id TEXT`).run();
    console.log("'group_id' column added to posts table");
  } else {
    console.log("'group_id' column already exists in posts table");
  }
};

const savePost = (db, postData) => {
  try {
    const existing = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postData.id);

    if (existing) {
      // Skip if the content and created_at are unchanged
      if (
        existing.content === postData.content &&
        existing.created_at === postData.created_at
      ) {
        return { success: true, result: existing, skipped: true };
      }
      const updateStmt = db.prepare(`
        UPDATE posts SET user_id = ?, group_id = ?, content = ?, created_at = ?
        WHERE id = ?
      `);
      updateStmt.run(
        postData.user_id,
        postData.group_id,
        postData.content,
        postData.created_at,
        postData.id 
      );

      return { success: true, result: postData, updated: true };
    }

    // Insert new post
    const insertStmt = db.prepare(`
      INSERT INTO posts (id, user_id, group_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertStmt.run(
      postData.id,
      postData.user_id,
      postData.group_id,
      postData.content,
      postData.created_at 
    );

    return { success: true, result: postData, inserted: true };

  } catch (error) {
    console.error('Error inserting/updating post:', error);
    return { success: false, error: error.message };
  }
};



const getPosts = (db) => {
  try {
    return db.prepare(`
      SELECT * FROM posts ORDER BY created_at DESC
    `).all();
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

const getPostById = (db, postId) => {
  try {
    return db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId) || null;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
};

const getPostsByUserId = (db, userId) => {
  try {
    return db.prepare(`
      SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId);
  } catch (error) {
    console.error('Error fetching posts by user ID:', error);
    return [];
  }
};

const getPostsByGroupId = (db, groupId) => {
  try {
    return db.prepare(`
      SELECT * FROM posts WHERE group_id = ? ORDER BY created_at DESC
    `).all(groupId);
  } catch (error) {
    console.error('Error fetching posts by group ID:', error);
    return [];
  }
};

const getLatestMessageByGroupId = (db, groupId) => {
  try {
    return db.prepare(`
      SELECT content, created_at
      FROM posts
      WHERE group_id = ?
      ORDER BY datetime(created_at) DESC
      LIMIT 1
    `).get(groupId);
  } catch (error) {
    console.error('Error getting latest message:', error);
    return null;
  }
};

const clearAllPosts = (db) => {
    try {
        db.prepare(`DELETE FROM posts`).run();
        return { success: true };
    } catch (error) {
        console.error('Error clearing posts table:', error);
        return { success: false, error: error.message };
    }
};



module.exports = {
  createPostsTable,
  savePost,
  getPosts,
  getPostById,
  getPostsByUserId,
  getPostsByGroupId,
  addGroupIdColumnIfMissing,
  migratePostsIdToText,
  getLatestMessageByGroupId,
  clearAllPosts
};
