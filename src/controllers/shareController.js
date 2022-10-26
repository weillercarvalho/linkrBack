import { STATUS_CODE } from '../enums/statusCodes.js';
import sharedRepository from '../repositories/shareRepository.js';

export async function sharePost(req, res) {
  const { postId, removeShare } = req.body;
  console.log('sharing');
  try {
    let shareRelation;
    if (removeShare) {
      shareRelation = (await sharedRepository.findSharedPost(postId)).rows[0];
      const postToRemove = shareRelation.sharedPostId;

      if (postToRemove === postId) {
        //remove post and relation:
        await sharedRepository.deleteSharedPost(postId);
      }

      return res.sendStatus(STATUS_CODE.OK);
    }

    console.log(shareRelation);

    return res.status(STATUS_CODE.OK);
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}
