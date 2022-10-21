import { connection } from "../database/db.js";

async function likerPost(userId, postId) {
    await connection.query(
      `INSERT INTO likes ("userLikedId", "postId") VALUES ($1, $2);`,
      [userId, postId]
    );
  };

async function isLiked(userId, postId) {
    const like = await connection.query(
      `SELECT * FROM likes WHERE "userLikedId" = $1 AND "postId" = $2`,
      [userId, postId]
    );
    if(like.rowCount > 0){
        return true;
    }else return false;
  };

async function dislikePost(userId, postId) {
  await connection.query(
    `DELETE FROM likes WHERE "userLikedId" = $1 AND "postId" = $2`,
    [userId, postId]
  );
};

export {likerPost, isLiked, dislikePost};