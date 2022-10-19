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
    await modUserPostRepository.deletePostByPostId(postId);
    return res.sendStatus(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}
