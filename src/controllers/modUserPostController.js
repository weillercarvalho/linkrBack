import { STATUS_CODE } from '../enums/statusCodes.js';
import modUserPostRepository from '../repositories/modUserPostRepository.js';

export async function updatePost(req, res) {
  const { user } = res.locals;
  const { postId, newMessage } = req.body;
  if (!newMessage || !postId) {
    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }
  try {
    const searchPost = await modUserPostRepository.searchPostByPostId(postId);
    if (!searchPost.rows) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }
    const [post] = searchPost.rows;
    if (post.userId !== user.id) {
      return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    }
    await modUserPostRepository.updatePostByPostId(newMessage, postId);
    return res.sendStatus(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

export async function deletePost(req, res) {
  const { user } = res.locals;
  const { postId } = req.body;

  if (!postId) {
    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }
  try {
    const searchPost = await modUserPostRepository.searchPostByPostId(postId);
    if (!searchPost.rows) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }
    const [post] = searchPost.rows;
    if (post.userId !== user.id) {
      return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    }

    //Verify if post to be deleted is on the share table
    //if it is, returns list of share posts

    const sharedList = (await modUserPostRepository.isPostShared(postId)).rows;

    console.log(postId);
    console.log(sharedList);

    if (!sharedList[0]) {
      console.log('Deleting post without shares');
      await modUserPostRepository.deleteLikeRelation(postId);
      await modUserPostRepository.deletePostByPostId(postId);
      return res.sendStatus(STATUS_CODE.OK);
    }

    for (let i = 0, len = sharedList.length; i < len; i++) {
      const postToBeDeleted = sharedList[i].sharedPostId;

      console.log('Deleting: ');
      console.log(postToBeDeleted);
      console.log('operation 1/3');

      //Deletes like relation
      await modUserPostRepository.deleteLikeRelation(postToBeDeleted);
      console.log('operation 2/3');

      //Deletes share relation
      await modUserPostRepository.deleteShareRelation(postToBeDeleted);
      console.log('operation 3/3');
      modUserPostRepository.deletePostBySharedPostId(postToBeDeleted);

      //Deletes shared post
      await modUserPostRepository.deletePostByPostId(postToBeDeleted);
    }

    //Deletes share relation
    await modUserPostRepository.deleteShareRelation(postId);
    await modUserPostRepository.deleteLikeRelation(postId);

    //Deletes post
    await modUserPostRepository.deletePostByPostId(postId);
    return res.sendStatus(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

export async function fetchUserId(req, res) {
  try {
    const userId = res.locals.user.id;
    return res.send({ userId: userId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}
