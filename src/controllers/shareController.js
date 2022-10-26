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
      const post = (await sharedRepository.findPostAndCopyContent(postId))
        .rows[0];
      post.shared = true;
      await sharedRepository.insertSharedPost(post, user);
      const latestPost = (await sharedRepository.fetchLatestInserted(post))
        .rows[0];

      const latestPostId = latestPost.id;
      await sharedRepository.createRelation(user.id, postId, latestPostId);
    }

    return res.status(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}
