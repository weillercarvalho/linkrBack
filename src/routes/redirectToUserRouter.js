import { Router } from 'express';
import {
  findUserByPost,
  findUsersByName,
  LoadUserPosts,
  findUserByID,
} from '../controllers/redirectToUserController.js';
import { validateToken } from '../middlewares/validateToken.js';

const redirectToUserRouter = Router();
redirectToUserRouter.get('/users/:id', validateToken, LoadUserPosts);
redirectToUserRouter.get('/findname', validateToken, findUsersByName);
redirectToUserRouter.get('/findpost', validateToken, findUserByPost);
redirectToUserRouter.get('/finduser', validateToken, findUserByID);

export default redirectToUserRouter;
