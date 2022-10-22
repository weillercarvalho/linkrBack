import { Router } from 'express';
import {
  updatePost,
  deletePost,
  fetchUserId,
} from '../controllers/modUserPostController.js';
import { validateToken } from '../middlewares/validateToken.js';

const modUserPostRouter = Router();
modUserPostRouter.put('/update', validateToken, updatePost);
modUserPostRouter.put('/delete', validateToken, deletePost);
modUserPostRouter.get('/fetchLoggedUserId', validateToken, fetchUserId);

export default modUserPostRouter;
