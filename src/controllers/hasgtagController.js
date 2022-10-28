import {
  hashtagList,
  hashtagPosts,
  findHashtagId,
  allPostHashRelantion,
} from "../repositories/hashtagRepositories.js";
import {
  findUser,
  findUserLikes,
  totalLikes,
  findUserShareds,
  totalShareds,
} from "../repositories/likeRepositories.js";

async function getHashtag(req, res) {
  try {
    const list = await hashtagList();
    res.status(200).send(list);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getHashtagId(req, res){
  const {name} = req.body;
  try{
    const id  = await findHashtagId(name);
    res.status(200).send(id);

  }catch(error){
    console.log(err);
    res.sendStatus(500);
  };
}

async function getHashtagPosts(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace(`Bearer `, ``);
  const { hashtag } = req.params;

  try {
    const query = await hashtagPosts(hashtag);
    if (!token) {
      return res.send(query.rows);
    }
    const user = await findUser(token);
    const userLikeList = await findUserLikes(user);
    const list = [];
    for (let index = 0; index < query.rows.length; index++) {
      const element = query.rows[index];
      if (userLikeList[element.PostId] !== 1) {
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
    const relationPostHash = {};
    const k = await allPostHashRelantion();
    for (let i = 0; i < k.length; i++) {
      const element = k[i];
      relationPostHash[element.postId] = element.hashtags;
    }

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (relationPostHash[element.id]) {
        list[i] = {
          ...element,
          hashs: relationPostHash[element.id],
        };
      } else
        list[i] = {
          ...element,
          hashs: [],
        };
    }

    const shareds = await findUserShareds(user);
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (shareds[element.PostId] !== 1) {
        list[index] = {
          ...element,
          shared: false,
        };
      } else
        list[index] = {
          ...element,
          shared: true,
        };
    }

    const totalSharedList = await totalShareds();
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (!totalSharedList[element.PostId]) {
        list[index] = {
          ...element,
          reshareCount: 0,
        };
        continue;
      } else
        list[index] = {
          ...element,
          reshareCount: totalSharedList[element.PostId],
        };
    }

    res.status(200).send(list);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message:
        "An error occured while trying to fetch the posts, please refresh the page",
    });
  }
}

export { getHashtag, getHashtagPosts, getHashtagId};
