import { STATUS_CODE } from '../enums/statusCodes.js';
import sharedRepository from '../repositories/shareRepository.js';

export async function sharePost(req, res) {
  const { postId, removeShare } = req.body;
  const { user } = res.locals;
  try {
    let shareRelation;
    if (removeShare) {
      shareRelation = (await sharedRepository.findSharedPost(postId)).rows[0];
      const postToRemove = shareRelation.sharedPostId;

      if (postToRemove === postId) {
        //remove post and relation:
        await sharedRepository.deleteSharedPost(postId);
      }
      return res.sendStatus(STATUS_CODE.OK);
    } else {
      const originalPostId = await findOriginalPost(postId, user.id);
      console.log('initialPostId: ', postId);
      console.log('originalPostId: ', originalPostId);
      const post = (
        await sharedRepository.findPostAndCopyContent(originalPostId)
      ).rows[0];
      post.shared = true;
      await sharedRepository.insertSharedPost(post, user);
      const latestPost = (await sharedRepository.fetchLatestInserted(post))
        .rows[0];

      const latestPostId = latestPost.id;
      await sharedRepository.createRelation(
        user.id,
        originalPostId,
        latestPostId
      );
    }

    return res.status(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

async function findOriginalPost(postId, userId, i = 0) {
  const post = (await sharedRepository.findOriginalPost(postId)).rows[0];
  console.log('recursion: ', i);
  //console.log('post: ', post);
  if (i === 5) {
    console.log('Recursion break');
    return null;
  }

  if (post.shared) {
    const latestPost = (
      await sharedRepository.findLatestPost(post.userId, postId)
    ).rows[0];

    console.log(latestPost);
    return findOriginalPost(
      latestPost.originalPostId,
      latestPost.userId,
      i + 1
    );
  }
  return post.id || postId;
}
