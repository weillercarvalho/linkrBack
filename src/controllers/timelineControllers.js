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

    return res.send(201);
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
      return res.send(query.rows);
    }
    const user = await findUser(token);
    const userLikeList = await findUserLikes(user);
    const list = [];
    for (let index = 0; index < query.rows.length; index++) {
      const element = query.rows[index];
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
    res.send(list);
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
