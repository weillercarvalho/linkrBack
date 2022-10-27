import { connection } from '../database/db.js';
import {
  insertPost,
  getPost,
  getPictures,
} from '../repositories/timelineRepositories.js';
import { isValidUrl } from '../schemas/urlSchema.js';
import {
  findUser,
  findUserLikes,
  totalLikes,
} from '../repositories/likeRepositories.js';
import {
  isThereHashtag,
  addRelationPostHashtag,
  addHashtag,
} from '../repositories/hashtagRepositories.js';
import redirectToUserRepository from '../repositories/redirectToUserRepository.js';
import sharedRepository from '../repositories/shareRepository.js';

async function postTimeline(req, res) {
  const { authorization } = req.headers;
  const { message, link, hashtags } = req.body;
  const token = authorization?.replace(`Bearer `, ``);
  if (!token) {
    return res.sendStatus(409);
  }

  try {
    const gettingUserId = await connection.query(
      `SELECT * FROM sessions WHERE token = $1 ORDER BY id DESC LIMIT 1`,
      [token]
    );

    const gettinToken = gettingUserId.rows[0].token;

    if (gettinToken !== token) {
      return res.sendStatus(409);
    }
    if (!isValidUrl(link)) {
      return res.sendStatus(422);
    }
    const useridinsert = gettingUserId.rows[0].userId;
    const postId = await insertPost(message, link, useridinsert);
    if (hashtags) {
      for (let index = 0; index < hashtags.length; index++) {
        const element = hashtags[index];
        const hashtagId = await isThereHashtag(element);
        if (hashtagId) {
          await addRelationPostHashtag(postId, hashtagId);
        } else {
          const hashId = await addHashtag(element);
          await addRelationPostHashtag(postId, hashId);
        }
      }
    }
    const query = await connection.query(
      `SELECT * FROM posts JOIN users ON posts."userId" = users.id ORDER BY posts.id DESC;`
    );
    return res.status(201).send(query.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message:
        'An error occured while trying to fetch the posts, please refresh the page',
    });
  }
}

async function getTimeline(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace(`Bearer `, ``);
  try {
    const query = await getPost();
    if (!token) {
      let userPosts = query.rows;
      for (let i = 0, totalPosts = userPosts.length; i < totalPosts; i++) {
        const originalPost = (
          await redirectToUserRepository.getOriginalPostBySharedPostId(
            userPosts[i].postId
          )
        ).rows[0];
        if (userPosts[i].shared && originalPost) {
          userPosts[i].message = originalPost.message;
          userPosts[i].picture = originalPost.avatar;
          userPosts[i].name = originalPost.username;
          userPosts[i].SharerName = originalPost.sharerName;
          userPosts[i].SharerId = originalPost.sharerId;
          userPosts[i].OriginalUserId = originalPost.userId;
        }

        if (originalPost) {
          const sharesCount = (
            await sharedRepository.countShares(originalPost.postId)
          ).rows[0].count;
          userPosts[i].reshareCount = sharesCount; //Math.round(Math.random() * 100);
        } else {
          userPosts[i].reshareCount = (
            await sharedRepository.countShares(userPosts[i].postId)
          ).rows[0].count;
        }
      }

      return res.send(userPosts);
    }
    const user = await findUser(token);
    const userLikeList = await findUserLikes(user);
    const list = [];
    for (let index = 0; index < query.rows.length; index++) {
      const element = query.rows[index];
      const originalPost = (
        await redirectToUserRepository.getOriginalPostBySharedPostId(
          element.postId
        )
      ).rows[0];
      if (element.shared) {
        //element.PostId = originalPost.postId;
        console.log(originalPost);

        element.message = originalPost.message;
        element.picture = originalPost.avatar;
        element.name = originalPost.username;
        element.SharerName = originalPost.sharerName;
        element.SharerId = originalPost.sharerId;
        element.OriginalUserId = originalPost.userId;
      }

      if (originalPost) {
        const sharesCount = (
          await sharedRepository.countShares(originalPost.postId)
        ).rows[0].count;
        element.reshareCount = sharesCount; //Math.round(Math.random() * 100);
      } else {
        element.reshareCount = (
          await sharedRepository.countShares(element.postId)
        ).rows[0].count;
      }

      if (userLikeList[element.postId] !== 1) {
        list.push({
          ...element,
          isLiked: false,
        });
      } else
        list.push({
          ...element,
          isLiked: true,
        });
    }
    const totalLikesList = await totalLikes();
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      console.log(element);
      if (!totalLikesList[element.postId]) {
        list[index] = {
          ...element,
          totalLikes: 0,
        };
        continue;
      } else
        list[index] = {
          ...element,
          totalLikes: totalLikesList[element.postId],
        };
    }
    return res.send(list);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message:
        'An error occured while trying to fetch the posts, please refresh the page',
    });
  }
}

async function getPicture(req, res) {
  try {
    const query = await getPictures();
    return res.send(query.rows[0]);
  } catch (error) {
    return res.status(500).send({
      message:
        'An error occured while trying to fetch the posts, please refresh the page',
    });
  }
}
export { postTimeline, getTimeline, getPicture };
