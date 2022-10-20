import { connection } from "../database/db.js";

async function likerPost({ userId, postId }) {
    await connection.query(
      `INSERT INTO likes ("userId", "postId") VALUES ($1, $2);`,
      [userId, postId]
    );
  };

async function isLiked({ userId, postId }) {
    const like = await connection.query(
      `SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`,
      [userId, postId]
    );
    if(like.rowCount > 0){
        return true;
    }else return false;
  };

export {likerPost, isLiked};