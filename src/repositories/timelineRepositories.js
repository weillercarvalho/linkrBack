import { connection } from '../database/db.js';

async function insertPost(message, link, useridinsert) {
  const query = await connection.query(
    `INSERT INTO posts (message,link,"userId") VALUES ($1,$2,$3)`,
    [message, link, useridinsert]
  );
  return query;
}

async function getPost() {
  //const query = await connection.query (`SELECT * FROM posts JOIN users ON posts."userId" = users.id ORDER BY posts.id DESC LIMIT 20;`);
  const query = await connection.query(`
    SELECT 
        p.id as "postId", 
        p.message , 
        p.link , 
        p."userId" , 
        p."createdAt" , 
        u."name" , 
        u.email , 
        u.picture 
    FROM posts p 
    JOIN users u ON p."userId" = u.id 
    ORDER BY p.id DESC 
    LIMIT 20;`);
  return query;
}

async function getPictures() {
  const query = await connection.query(
    `SELECT users.picture FROM sessions JOIN users ON users.id = sessions."userId" ORDER BY sessions.id DESC LIMIT 1;`
  );
  return query;
}

export { insertPost, getPost, getPictures };
