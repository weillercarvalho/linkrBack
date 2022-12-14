import { connection } from '../database/db.js';

async function insertPost(message, link, useridinsert) {
  await connection.query(
    `INSERT INTO posts (message,link,"userId") VALUES ($1,$2,$3)`,
    [message, link, useridinsert]
  );

  const idPost = await connection.query(
    `SELECT id 
    FROM posts 
    WHERE "userId" = $1 AND link = $2 AND message = $3
    ORDER BY id DESC
    LIMIT 1;`,
    [useridinsert, link, message]
  );
  return idPost.rows[0].id;
}

async function getPost(limit, offset) {
  let offsetQuery;
  if (!offset) {
    offsetQuery = 0;
  } else {
    offsetQuery = Number(offset);
  }

  const query = await connection.query(
    `
    SELECT 
        p.id as "postId", 
        p.message , 
        p.link , 
        p."userId" ,  
        u."name" , 
        u.email , 
        u.picture,
        p.shared 
    FROM posts p 
    JOIN users u ON p."userId" = u.id 
    ORDER BY p.id DESC
    LIMIT $1
    OFFSET $2
    ;`,
    [limit, offsetQuery]
  );
  return query;
}

async function getPictures() {
  const query = await connection.query(
    `SELECT users.picture FROM sessions JOIN users ON users.id = sessions."userId" ORDER BY sessions.id DESC LIMIT 1;`
  );
  return query;
}

export { insertPost, getPost, getPictures };
