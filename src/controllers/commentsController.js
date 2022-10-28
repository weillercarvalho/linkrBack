import {
  createCommentsRepositories,
  getComments,
} from '../repositories/commentsRpositories.js';
import { STATUS_CODE } from '../enums/statusCodes.js';
import modUserPostRepository from '../repositories/modUserPostRepository.js';
import redirectToUserRepository from '../repositories/redirectToUserRepository.js';

async function insertComments(req, res) {
  const { comment } = req.body;
  const { postId } = req.params; //id do post que foi comentado

  if (!comment) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .send({ error: 'message invalid' });
  }

  try {
    const user = res.locals.user;
    await createCommentsRepositories({
      comment: comment,
      userId: user.id,
      postId: postId,
    });

    res.sendStatus(STATUS_CODE.CREATED);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function listComments(req, res) {
  const { postId } = req.params;
  try {
    const postInfo = (
      await modUserPostRepository.searchPostByPostIdAndGetAllInfo(postId)
    ).rows[0];

    if (postInfo.shared) {
      console.log(postInfo);
      const originalPost = (
        await redirectToUserRepository.getOriginalPostBySharedPostId(
          postInfo.id
        )
      ).rows[0];

      listComments = await getComments(originalPost);

      console.log(listComments);
    } else {
      listComments = await getComments({ postId });
    }

    res.send(listComments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { insertComments, listComments };
