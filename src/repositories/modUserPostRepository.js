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
function deletePostByPostId(postId) {
  return connection.query(
    `
      delete posts 
      where id = $1;	
      `,
    [postId]
  );
}
