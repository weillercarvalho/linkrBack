import { connection } from '../database/db.js';

function createShareRelation(userId, oldPostId, newPostId) {
  return connection.query(
    `
      insert into share("userId", "originalPostId", "sharedPostId")
      values ($1, $2, $3);
      `,
    [userId, oldPostId, newPostId]
  );
}

function getOldPost(postId) {}

async function createSharedPost(message, link, userId) {
  await connection.query(
    `
  insert into posts(message, link, "userId", shared)
  values ($1, $2, $3, true);
  `,
    [message, link, userId]
  );

  const idPost = await connection.query(
    `SELECT id 
    FROM posts 
    WHERE "userId" = $1 AND link = $2 AND message = $3
    ORDER BY id DESC
    LIMIT 1;`,
    [userId, link, message]
  );
  return idPost.rows[0].id;
}

function findSharedPost(postId) {
  return connection.query(
    `
    select * from share
    where "sharedPostId" = $1
  `,
    [postId]
  );
}

function deleteSharedPost(postId) {
  connection.query(`delete from share where "sharedPostId" = $1;`, [postId]);
  connection.query(`delete from posts where id = $1;`, [postId]);
  return;
}

const sharedRepository = {
  createShareRelation,
  getOldPost,
  createSharedPost,
  findSharedPost,
  deleteSharedPost,
};

export default sharedRepository;
