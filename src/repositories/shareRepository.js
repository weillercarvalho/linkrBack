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

function findPostAndCopyContent(postId) {
  return connection.query(`select * from posts p where p.id = $1;`, [postId]);
}

function insertSharedPost(post, user) {
  return connection.query(
    `insert into posts(message, link, "userId", shared)
    values ($1, $2, $3, $4);`,
    [post.message, post.link, user.id, post.shared]
  );
}

function fetchLatestInserted(post) {
  return connection.query(
    `select * from posts
    where "message"=$1 and "link"=$2 and shared=true
    order by id DESC
    limit 1;`,
    [post.message, post.link]
  );
}

function createRelation(userId, oldId, newId) {
  return connection.query(
    `
  insert into share("userId", "originalPostId", "sharedPostId")
  values ($1, $2, $3);
  `,
    [userId, oldId, newId]
  );
}

const sharedRepository = {
  createShareRelation,
  getOldPost,
  createSharedPost,
  findSharedPost,
  deleteSharedPost,
  findPostAndCopyContent,
  insertSharedPost,
  fetchLatestInserted,
  createRelation,
};

export default sharedRepository;
