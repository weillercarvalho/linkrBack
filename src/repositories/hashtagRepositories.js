import { connection } from '../database/db.js';

async function hashtagList() {
  const list = await connection.query(`SELECT 
    MAX("hashtagId") AS "id", 
    name, 
    COUNT(*) AS "postCount" 
    FROM posthashtags 
    LEFT JOIN hashtags ON posthashtags."hashtagId" = hashtags.id 
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
    posts.id AS "PostId", 
    "hashtagId", 
    message AS "Message", 
    link AS "Link", 
    "userId", 
    email,
    picture AS "Avatar",
    users.name AS "UserName",
    hashtags.name AS "hashtag"
    FROM posthashtags
    JOIN posts ON postHashtags."postId" = posts.id
    JOIN users ON posts."userId"= users.id 
    JOIN hashtags ON "hashtagId"= hashtags.id 
    WHERE "hashtagId" = $1
    ORDER BY postHashtags.id DESC;
    `,
    [str]
  );

  return list;
}

async function addRelationPostHashtag(postId, hashtagId) {
  await connection.query(
    `INSERT INTO posthashtags("postId", "hashtagId")
        VALUES($1, $2);`,
    [postId, hashtagId]
  );
}

async function allPostHashRelantion(){
    const list  = await connection.query(
        `Select "postId", ARRAY_AGG("hashtagId") AS "hashtags" FROM posthashtags GROUP BY "postId";`);
    
    return list.rows
}

async function findHashtagId(str){
  const id = await connection.query(`
  SELECT * 
  FROM hashtags
  WHERE name = $1;
  `, [str]);
  return id.rows;
}


export {hashtagList, findHashtagId, allPostHashRelantion, isThereHashtag, addHashtag, hashtagPosts, addRelationPostHashtag};
