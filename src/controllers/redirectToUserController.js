import { STATUS_CODE } from '../enums/statusCodes.js';
import {
  findUser,
  findUserLikes,
  totalLikes,
} from '../repositories/likeRepositories.js';
import redirectToUserRepository from '../repositories/redirectToUserRepository.js';
import sharedRepository from '../repositories/shareRepository.js';

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
    const { token } = res.locals;
    const userLikesId = await findUser(token);
    const userLikeList = await findUserLikes(userLikesId);
    console.log(userLikeList);
    const list = [];

    for (let i = 0, totalPosts = userPosts.length; i < totalPosts; i++) {
      const originalPost = (
        await redirectToUserRepository.getOriginalPostBySharedPostId(
          userPosts[i].PostId
        )
      ).rows[0];
      if (userPosts[i].shared) {
        userPosts[i].Message = originalPost.message;
        userPosts[i].Avatar = originalPost.avatar;
        userPosts[i].Username = originalPost.username;
        userPosts[i].SharerName = originalPost.sharerName;
        userPosts[i].SharerId = originalPost.sharerId;
        userPosts[i].OriginalUserId = originalPost.userId;
      }

      if (originalPost) {
        const sharesCount = (
          await sharedRepository.countShares(originalPost.postId)
        ).rows[0].count;
        userPosts[i].reshareCount = sharesCount;
        if (userLikeList[originalPost.postId] !== 1) {
          list.push({
            ...userPosts[i],
            isLiked: false,
          });
        } else
          list.push({
            ...userPosts[i],
            isLiked: true,
          });
      } else {
        userPosts[i].reshareCount = (
          await sharedRepository.countShares(userPosts[i].PostId)
        ).rows[0].count;

        if (userLikeList[userPosts[i].PostId] !== 1) {
          list.push({
            ...userPosts[i],
            isLiked: false,
          });
        } else
          list.push({
            ...userPosts[i],
            isLiked: true,
          });
      }
    }

    const totalLikesList = await totalLikes();
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (!element.shared) {
        if (!totalLikesList[element.PostId]) {
          list[index] = {
            ...element,
            totalLikes: 0,
          };
          continue;
        } else
          list[index] = {
            ...element,
            totalLikes: totalLikesList[element.PostId],
          };
      }
      if (element.shared) {
        const originalPost = (
          await redirectToUserRepository.getOriginalPostBySharedPostId(
            element.PostId
          )
        ).rows[0];
        if (!totalLikesList[originalPost.postId]) {
          list[index] = {
            ...element,
            totalLikes: 0,
          };
          continue;
        } else
          list[index] = {
            ...element,
            totalLikes: totalLikesList[originalPost.postId],
          };
      }
    }

    //console.log(list[0]);
    //console.log(userPosts[0]);

    return res.status(STATUS_CODE.OK).send(list);
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
