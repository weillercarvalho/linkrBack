import { connection } from "../database/db.js";

async function createCommentsRepositories({ userId, comment, postId }) {
  await connection.query(
    `INSERT INTO comments ("userId", "message", "postId") VALUES ($1, $2, $3);`,
    [userId, comment, postId]
  );
}

async function getComments({ postId }) {
  const lstComments = await connection.query(
    `SELECT 
            comments.message, 
            users.picture, 
            users.id AS "idUserComment", 
            users.name 
        FROM comments 
        JOIN users ON comments."userId" = users.id 
        WHERE comments."postId" = $1;`,
    [postId]
  );
  return lstComments.rows;
}

export { createCommentsRepositories, getComments };
