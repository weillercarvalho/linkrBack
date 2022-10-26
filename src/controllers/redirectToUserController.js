import { STATUS_CODE } from '../enums/statusCodes.js';
import redirectToUserRepository from '../repositories/redirectToUserRepository.js';

export async function LoadUserPosts(req, res) {
  const { id } = req.params;
  const userId = id;
  if (!userId || !Number(userId)) {
    return res
      .send({ error: 'not a valid user' })
      .status(STATUS_CODE.BAD_REQUEST);
  }
  try {
    let userPosts = await redirectToUserRepository.getPostsByUserId(userId);
    userPosts = userPosts.rows;
    if (!userPosts) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }

    for (let i = 0, totalPosts = userPosts.length; i < totalPosts; i++) {
      if (userPosts[i].shared) {
        const originalPost = (
          await redirectToUserRepository.getOriginalPostBySharedPostId(
            userPosts[i].PostId
          )
        ).rows[0];
        //userPosts[i].PostId = originalPost.postId;
        userPosts[i].Message = originalPost.message;
        userPosts[i].Avatar = originalPost.avatar;
        userPosts[i].Username = originalPost.username;
        userPosts[i].SharerName = originalPost.sharerName;
        userPosts[i].SharerId = originalPost.sharerId;
        userPosts[i].OriginalUserId = originalPost.userId;
      }

      userPosts[i].reshareCount = 0;
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
  const { name } = req.query;
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

export async function findUserByID(req, res) {
  const { userId } = req.query;
  if (!Number(userId)) {
    return res.sendStatus(STATUS_CODE.UNPROCESSABLE);
  }
  try {
    let userInfo = await redirectToUserRepository.getUserInfoByUserId(userId);
    userInfo = userInfo.rows;
    if (!userInfo[0]) {
      return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }
    userInfo = userInfo[0];
    return res.status(STATUS_CODE.OK).send({
      id: userInfo.id,
      name: userInfo.name,
      picture: userInfo.picture,
    });
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}
