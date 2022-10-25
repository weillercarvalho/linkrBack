import { connection } from '../database/db.js';

async function hashtagList() {
  const list = await connection.query(`SELECT 
    MAX("hashtagId") AS "id", 
    name, 
    COUNT(*) AS "postCount" 
    FROM posthashtag 
    LEFT JOIN hashtags ON posthashtag."hashtagId" = hashtags.id 
    GROUP BY name 
    ORDER BY "postCount" DESC 
    LIMIT 10;
    `);

  return list.rows;
}

async function isThereHashtag(str) {
  const hashtags = await connection.query(
    `SELECT * FROM hashtags WHERE name = $1;`,
    [str]
  );

  if (hashtags.rowCount > 0) {
    return hashtags.rows[0].id;
  } else return false;
}

async function addHashtag(str) {
  await connection.query(`INSERT INTO hashtags (name) VALUES($1);`, [str]);
  const hashtagId = await connection.query(
    `SELECT id FROM hashtags WHERE name = $1;`,
    [str]
  );
  return hashtagId.rows[0].id;
}

async function hashtagPosts(str) {
  const list = await connection.query(
    `
    SELECT 
    posts.id, 
    "hashtagId", 
    message, 
    link, 
    "userId", 
    "createdAt",
    email,
    picture,
    users.name,
    hashtags.name AS "hashtag"
    FROM postHashtag 
    JOIN posts ON postHashtag."postId" = posts.id
    JOIN users ON posts."userId"= users.id 
    JOIN hashtags ON "hashtagId"= hashtags.id 
    WHERE "hashtagId" = $1
    ORDER BY postHashtag.id DESC;
    `,
    [str]
  );

  return list;
}

async function addRelationPostHashtag(postId, hashtagId) {
  await connection.query(
    `INSERT INTO postHashtag ("postId", "hashtagId")
        VALUES($1, $2);`,
    [postId, hashtagId]
  );
}

export {
  hashtagList,
  isThereHashtag,
  addHashtag,
  hashtagPosts,
  addRelationPostHashtag,
};
