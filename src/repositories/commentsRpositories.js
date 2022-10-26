import { connection } from "../database/db.js";

async function createCommentsRepositories({ userId, comment, postId }) {
  await connection.query(
    `INSERT INTO comments ("userId", "message", "postId") VALUES ($1, $2, $3);`,
    [userId, comment, postId.rows[0].id]
  );
}

async function getComments({ postId }) {
  await connection.query(
    `SELECT 
            comments.message, 
            users.picture, 
            users.id, 
            users.name 
        FROM comments 
        JOIN users ON comments."userId" = users.id 
        WHERE comments."postId" = $1;`,
    [postId]
  );
}

export { createCommentsRepositories, getComments };
