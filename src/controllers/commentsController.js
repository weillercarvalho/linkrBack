import {
  createCommentsRepositories,
  getComments,
} from "../repositories/commentsRpositories.js";
import { STATUS_CODE } from "../enums/statusCodes.js";
import { connection } from "../database/db.js";

async function insertComments(req, res) {
  const { comment } = req.body;
  const { postId } = req.params; //id do post que foi comentado

  const idPost = await connection.query(
    `SELECT id FROM posts WHERE $1 = posts.id;`,
    [postId]
  );

  if (!comment || idPost.length > 0) {
    return res.sendStatus(STATUS_CODE.BAD_REQUEST);
  }

  try {
    const user = res.locals.user;
    await createCommentsRepositories({
      comment: comment,
      userId: user.id, //userId é de quem ta comentando.
      postId: idPost,
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
    await getComments({ postId });
    res.sendStatus(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { insertComments, listComments };
