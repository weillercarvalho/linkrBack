import { connection } from '../database/db.js';

//Returns posts made by "userId"
function getPostsByUserId(userId) {
  return connection.query(
    `
    select 
      p.id as "PostId",
      u1."name" as "Username", 
      u1.picture as "Avatar", 
      p.message as "Message", 
      p.link as "Link", 
      l1."userLikedId" as "IdLiked", 
      u2."name" as "LikedName",
      p.shared
    from posts p
    full outer join users u1 on u1.id = p."userId" 
    full outer join likes l1 on p.id = l1."postId"
    full outer join users u2 on u2.id = l1."userLikedId"
    where p."userId" = $1
    group by u1."name", u1.picture, p.message, p.link, l1."userLikedId", u2."name", p.id 
    order by p.id desc
    limit 20
    ;
    `,
    [userId]
  );
}

function getLikesByUserId(userId) {
  return connection.query(
    `
    select 
      p.id as "postId", 
      count(l."postId") as "Likes"
    from likes l
    full outer join posts p on p.id = l."postId" 
    where p."userId" = $1
    group by l."postId", p.id 
    ;
    `,
    [userId]
  );
}

//Returns users where name includes "userName"
function getUserIdByName(userName) {
  return connection.query(
    `
    select 
      u.id, 
      u."name", 
      u.picture  
    from users u 
    where u."name" ilike $1
    ;
    `,
    [userName]
  );
}

//Returns userId where userId equals post.userId
function getUserIdByPostId(postId) {
  return connection.query(
    `
    select u.id 
    from users u 
    join posts p on p."userId" = u.id 
    where p.id = $1
    ;
    `,
    [postId]
  );
}

//Returns user info when searching for u.id === userId
function getUserInfoByUserId(userId) {
  return connection.query(`select * from users u where u.id = $1`, [userId]);
}

function getOriginalPostBySharedPostId(postId) {
  return connection.query(
    `
    select p.id as "postId", p.message as "message", p.link as "link", p."userId" as "userId" , u.name as "username" , u.picture as "avatar", u2.name as "sharerName", u2.id as "sharerId"
    from share s 
    join posts p on p.id = s."originalPostId" 
    join users u on u.id = p."userId"
    join users u2 on u2.id = s."userId"
    where s."sharedPostId" = $1
    ;
    `,
    [postId]
  );
}

const redirectToUserRepository = {
  getPostsByUserId,
  getLikesByUserId,
  getUserIdByName,
  getUserIdByPostId,
  getUserInfoByUserId,
  getOriginalPostBySharedPostId,
};

export default redirectToUserRepository;
