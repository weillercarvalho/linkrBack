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

async function findUser(token){
  const id = await connection.query(`SELECT "userId" FROM sessions WHERE token = $1`, [token]);
  return id.rows[0].userId;
}

async function findUserLikes(userId){
  const id = await connection.query(`SELECT * FROM likes WHERE "userLikedId" = $1`, [userId]);
  const posts ={};
  for (let index = 0; index < id.rows.length; index++) {
    const element = id.rows[index];
    posts[element.postId] = 1;  
  }
  return posts;
};

async function findUserShareds(userId){
  const id = await connection.query(`SELECT * FROM share WHERE "userId" = 2;`);
  const posts ={};
  for (let index = 0; index < id.rows.length; index++) {
    const element = id.rows[index];
    posts[element.sharedPostId] = 1;  
  }
  return posts;
};

async function totalLikes(){
  const list  = await connection.query(
    `SELECT "postId", COUNT(*) 
    FROM likes GROUP BY "postId";`
  )
  const totalList={};
  for (let index = 0; index < list.rows.length; index++) {
    const element = list.rows[index];
    totalList[element.postId] = element.count;
  }
  return totalList
};

async function totalShareds(){
  const list  = await connection.query(
    `SELECT "originalPostId", COUNT(*) 
    FROM share GROUP BY "originalPostId";`
  )
  const totalList={};
  for (let index = 0; index < list.rows.length; index++) {
    const element = list.rows[index];
    totalList[element.originalPostId] = element.count;
  }
  return totalList
};

async function getNamePostLikers(idPost){
  const list = await connection.query(
    `SELECT 
    "postId" AS id, 
    users.name 
    FROM likes 
    JOIN users ON likes."userLikedId"=users.id 
    WHERE "postId"= $1;
    `,[idPost]
  );
  return list.rows;
}


export {likerPost, totalShareds, findUserShareds, isLiked, dislikePost,getNamePostLikers, findUser, findUserLikes, totalLikes};