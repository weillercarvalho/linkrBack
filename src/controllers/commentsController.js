import {
  createCommentsRepositories,
  getComments,
} from "../repositories/commentsRpositories.js";
import { STATUS_CODE } from "../enums/statusCodes.js";

async function insertComments(req, res) {
  const { comment } = req.body;
  const { postId } = req.params; //id do post que foi comentado

  if (!comment) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .send({ error: "message invalid" });
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
    const listComments = await getComments({ postId });

    res.send(listComments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { insertComments, listComments };
