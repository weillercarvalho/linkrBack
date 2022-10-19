import { connection } from '../database/db.js';

//Returns posts made by "userId"
function getPostsByUserId(userId) {
  return connection.query(
    `
    select u1."name" as "Username", u1.picture as "Avatar", p.message as "Message", p.link as "Link", count(l1."userLikedId") as "Likes", u2."name" as "LikedName" 
    from posts p
    join users u1 on u1.id = p."userId" 
    join likes l1 on p.id = l1."postId"
    join users u2 on u2.id = l1."userLikedId"
    where p."userId" = $1
    group by u1."name", u1.picture, p.message, p.link, l1."userLikedId", u2."name"
    ;
    `,
    [userId]
  );
}

//Returns users where name includes "userName"
function getUserIdByName(userName) {
  return connection.query(
    `
    select u.id, u."name", u.picture  
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

export default redirectToUserRepository = {
  getPostsByUserId,
  getUserIdByName,
  getUserIdByPostId,
};
