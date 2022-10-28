import { connection } from '../database/db.js';

//Searches post by postId (used to verify: post.userId === user.id)
function searchPostByPostId(postId) {
  return connection.query(
    `
      select p."userId"  
      from posts p
      where p.id = $1
      ;
      `,
    [postId]
  );
}

//Updates post where postId equals the postId that's being searched
function updatePostByPostId(newMessage, postId) {
  return connection.query(
    `
      update posts 
      set message = $1
      where id = $2;	
      `,
    [newMessage, postId]
  );
}

//Deletes post where postId equals the postId that's being searched
async function deletePostByPostId(postId) {
  await connection.query(
    `
    delete from likes l where l."postId"  = $1;
      `,
    [postId]
  );
  return connection.query(
    `
    delete from posts p where p.id = $1;
      `,
    [postId]
  );
}

function isPostShared(postId) {
  return connection.query(
    `
  select * from share where "originalPostId" = $1; 
    `,
    [postId]
  );
}

function deleteShareRelation(postId) {
  return connection.query(
    `
  delete from share where "originalPostId" = $1; 
    `,
    [postId]
  );
}

function deleteLikeRelation(postId) {
  return connection.query(
    `
    delete from likes where "postId" = $1; 
    `,
    [postId]
  );
}

function deletePostBySharedPostId(postId) {
  return connection.query(
    `
    delete from share where "sharedPostId" = $1; 
    `,
    [postId]
  );
}

function deleteCommentsBySharedPostId(postId) {
  return connection.query(
    `
    delete from "comments" where "postId" = $1; 
    `,
    [postId]
  );
}

function searchPostByPostIdAndGetAllInfo(postId) {
  return connection.query(
    `
      select *  
      from posts p
      where p.id = $1
      ;
      `,
    [postId]
  );
}

const modUserPostRepository = {
  searchPostByPostId,
  updatePostByPostId,
  deletePostByPostId,
  isPostShared,
  deleteShareRelation,
  deleteLikeRelation,
  deletePostBySharedPostId,
  searchPostByPostIdAndGetAllInfo,
  deleteCommentsBySharedPostId,
};

export default modUserPostRepository;
