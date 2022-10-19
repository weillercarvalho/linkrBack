import { STATUS_CODE } from '../enums/statusCodes.js';
import redirectToUserRepository from '../repositories/redirectToUserRepository.js';

export async function LoadUserPosts(req, res) {
  const { userId } = req.body;
  try {
    let userPosts = await redirectToUserRepository.getPostsByUserId(userId);
    userPosts = userPosts.rows;
    if (!userPosts) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }
    let userLikes = await redirectToUserRepository.getLikesByUserId(userId);
    userLikes = userLikes.rows;

    return res.status(STATUS_CODE.OK).send({ userPosts, userLikes });
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

export async function findUsersByName(req, res) {
  const { name } = req.body;
  try {
    let users = await redirectToUserRepository.getUserIdByName(name);
    users = users.rows;
    if (!users) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }

    return res.status(STATUS_CODE.OK).send(users);
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

export async function findUserByPost(req, res) {
  const { postId } = req.body;
  try {
    let userId = await redirectToUserRepository.getUserIdByPostId(postId);
    userId = userId.rows;
    if (!userId) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }

    return res.status(STATUS_CODE.OK).send(userId);
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}
